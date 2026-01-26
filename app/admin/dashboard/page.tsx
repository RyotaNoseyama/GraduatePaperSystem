"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  workerId: string;
  dayIdx: number;
  answer: string;
  scoreA: number | null;
  scoreB: number | null;
  submittedAt: string | null;
}

type SubmissionProcessResult = {
  submissionId: string;
  success: boolean;
  openaiResponse?: string;
  parsedResponse?: OpenAIResponse;
  error?: string;
};

type OpenAIResponse = {
  is_relevant: boolean;
  scores: {
    theory_breakdown: number[];
    theory_total: number;
    human_breakdown: {
      empathy: number;
      context: number;
    };
    human_total: number;
    grand_total: number;
  };
  feedback_title: string;
  feedback_content: string;
};

async function processSubmissionsSequentially(
  submissions: Submission[],
  prompt?: string,
): Promise<SubmissionProcessResult[]> {
  const results: SubmissionProcessResult[] = [];

  for (const submission of submissions) {
    try {
      const response = await fetch("/api/admin/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
          prompt: prompt || undefined,
        }),
      });

      const data = await response.json();
      let parsedResponse: OpenAIResponse | undefined;
      if (response.ok && data.openaiResponse) {
        try {
          parsedResponse = JSON.parse(data.openaiResponse) as OpenAIResponse;
        } catch (e) {
          console.error("Failed to parse OpenAI response:", e);
        }
      }
      results.push({
        submissionId: submission.id,
        success: response.ok,
        openaiResponse: data.openaiResponse,
        parsedResponse,
        error: response.ok ? undefined : data.error || "Unknown error",
      });
    } catch (error) {
      results.push({
        submissionId: submission.id,
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  }

  return results;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [processResults, setProcessResults] = useState<
    SubmissionProcessResult[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dayIdxFilter, setDayIdxFilter] = useState<string>("");
  const pendingSubmissions = submissions.filter(
    (submission) => submission.scoreA === null,
  );
  const scoredSubmissions = submissions.filter(
    (submission) => submission.scoreA !== null,
  );

  useEffect(() => {
    // クライアント側でトークンを検証するのは簡略化のため
    // 本来はサーバーサイドで検証すべき
    const checkAuth = async () => {
      // クッキーからトークンを読む（クライアント側では直接読めないため、API経由でも良い）
      // ここは簡略化して、サーバーコンポーネントに変更することも検討
      setIsLoading(false);

      // submissionsを取得
      await fetchSubmissions();
    };

    checkAuth();
  }, [router]);

  const fetchSubmissions = async () => {
    try {
      const url = dayIdxFilter
        ? `/api/submissions?dayIdx=${encodeURIComponent(dayIdxFilter)}`
        : "/api/submissions";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
        setSelectedSubmissions([]);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      toast.error("提出データの取得に失敗しました");
    }
  };

  const handleSearchByDay = async () => {
    await fetchSubmissions();
  };

  const toggleSubmissionSelection = (submissionId: string) => {
    setSelectedSubmissions((prev) =>
      prev.includes(submissionId)
        ? prev.filter((id) => id !== submissionId)
        : [...prev, submissionId],
    );
  };

  const handleSendDayToOpenAI = async () => {
    if (!dayIdxFilter) {
      toast.error("dayIdx を入力してください");
      return;
    }

    setIsProcessing(true);
    setAiResponse("");

    try {
      const response = await fetch("/api/admin/openai/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayIdx: Number(dayIdxFilter),
          prompt: customPrompt || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          `dayIdx=${dayIdxFilter} を処理しました: ${data.totalProcessed}件`,
        );
        setAiResponse(
          Array.isArray(data.results)
            ? data.results
                .map(
                  (r: any, i: number) =>
                    `#${i + 1} ${r.success ? "OK" : "NG"} (${r.workerId})\n${r.openaiResponse || r.error || ""}`,
                )
                .join("\n\n")
            : "",
        );
      } else {
        toast.error(data.error || "処理に失敗しました");
      }
    } catch (error) {
      console.error("OpenAI API day-batch error:", error);
      toast.error("OpenAI API（一括）の呼び出しに失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSaveToDatabase = async () => {
    if (processResults.length === 0) {
      toast.error("保存する結果がありません");
      return;
    }

    setIsSaving(true);

    try {
      let savedCount = 0;
      let failedCount = 0;

      for (const result of processResults) {
        if (result.success && result.parsedResponse) {
          try {
            const response = await fetch("/api/admin/submissions/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                submissionId: result.submissionId,
                scoreA: result.parsedResponse.scores.theory_total,
                scoreB: result.parsedResponse.scores.human_total,
                feedback: result.parsedResponse.feedback_content,
              }),
            });

            if (response.ok) {
              savedCount++;
            } else {
              failedCount++;
            }
          } catch (error) {
            console.error("Failed to save submission:", error);
            failedCount++;
          }
        }
      }

      if (savedCount > 0) {
        toast.success(`${savedCount}件をDBに保存しました`);
        await fetchSubmissions(); // Refresh the submissions list
        setProcessResults([]);
        setAiResponse("");
        setSelectedSubmissions([]);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount}件の保存に失敗しました`);
      }
    } catch (error) {
      console.error("Save to database error:", error);
      toast.error("DBへの保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendToOpenAI = async () => {
    if (selectedSubmissions.length === 0) {
      toast.error("提出を選択してください");
      return;
    }

    setIsProcessing(true);
    setAiResponse("");

    try {
      const targetSubmissions = submissions.filter((submission) =>
        selectedSubmissions.includes(submission.id),
      );

      const results = await processSubmissionsSequentially(
        targetSubmissions,
        customPrompt || undefined,
      );

      setProcessResults(results);

      const successCount = results.filter((result) => result.success).length;
      const summary = results
        .map((result, index) => {
          const status = result.success ? "OK" : "NG";
          const detail = result.openaiResponse || result.error || "";
          return `#${index + 1} ${status} (${result.submissionId})\n${detail}`;
        })
        .join("\n\n");

      setAiResponse(summary);
      toast.success(
        `${successCount}/${results.length} 件の Submission を処理しました`,
      );
    } catch (error) {
      console.error("OpenAI API error:", error);
      toast.error("OpenAI APIの呼び出しに失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    dayIdx
                  </label>
                  <Input
                    value={dayIdxFilter}
                    onChange={(e) => setDayIdxFilter(e.target.value)}
                    placeholder="例: 1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSearchByDay}>
                    検索
                  </Button>
                  {/* <Button
                    onClick={handleSendDayToOpenAI}
                    disabled={!dayIdxFilter || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        この日のSubmissionを一括送信
                      </>
                    )}
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Dashboard content will be added here
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Participant management will be added here
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">提出データの管理</p>
              未採点の件数：{pendingSubmissions.length}
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                  {pendingSubmissions.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      提出データがありません
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pendingSubmissions.map((submission) => {
                        const isSelected = selectedSubmissions.includes(
                          submission.id,
                        );
                        return (
                          <div
                            key={submission.id}
                            onClick={() =>
                              toggleSubmissionSelection(submission.id)
                            }
                            className={`p-3 border rounded cursor-pointer transition-colors ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  Worker: {submission.workerId}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Day: {submission.dayIdx} | Score A:{" "}
                                  {submission.scoreA ?? "N/A"} | Score B:{" "}
                                  {submission.scoreB ?? "N/A"}
                                </p>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                  {submission.answer}
                                </p>
                              </div>
                              <span
                                className={`text-xs font-semibold ${
                                  isSelected
                                    ? "text-blue-600"
                                    : "text-slate-400"
                                }`}
                              >
                                {isSelected ? "Selected" : "Tap to select"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scored Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">scoreAが入力済みの提出一覧</p>
              採点済みの件数：{scoredSubmissions.length}
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                  {scoredSubmissions.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      採点済みの提出がありません
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {scoredSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="p-3 border rounded bg-white"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                Worker: {submission.workerId}
                              </p>
                              <p className="text-xs text-slate-500">
                                Day: {submission.dayIdx} | Score A:{" "}
                                {submission.scoreA ?? "N/A"} | Score B:{" "}
                                {submission.scoreB ?? "N/A"}
                              </p>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                {submission.answer}
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-green-600">
                              Scored
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OpenAI API Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    選択されたSubmission ID
                  </label>
                  <Input
                    value={selectedSubmissions.join(", ")}
                    readOnly
                    placeholder="上から提出を選択してください"
                    className="bg-slate-50"
                  />
                </div>

                {/* <div>
                  <label className="text-sm font-medium mb-2 block">
                    カスタムプロンプト（オプション）
                  </label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="デフォルト: 以下の回答を評価してください。回答の質、明確さ、完成度を1-10のスケールで評価し、改善点を提案してください。"
                    rows={4}
                  />
                </div> */}

                <div className="space-y-2">
                  <Button
                    onClick={handleSendToOpenAI}
                    disabled={selectedSubmissions.length === 0 || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        処理中...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        OpenAI APIに送信
                      </>
                    )}
                  </Button>

                  {processResults.length > 0 && (
                    <Button
                      onClick={handleSaveToDatabase}
                      disabled={isSaving}
                      variant="default"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        "DBに保存"
                      )}
                    </Button>
                  )}
                </div>

                {aiResponse && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-md border">
                    <h4 className="text-sm font-medium mb-2">
                      OpenAI APIの応答:
                    </h4>
                    <div className="text-sm whitespace-pre-wrap text-slate-700">
                      {aiResponse}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
