"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Instructions } from "@/components/task/instructions";
import { CaptionForm } from "@/components/task/caption-form";
import { Loading } from "@/components/task/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { GroupInfo, getGroupMessage } from "@/lib/group-utils";
import { Button } from "@/components/ui/button";

export function TaskPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const nextTaskNumberParam = searchParams.get("nextTaskNumber");
  const nextTaskNumber = nextTaskNumberParam
    ? parseInt(nextTaskNumberParam)
    : null;
  const [completionCode, setCompletionCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [taskNumber, setTaskNumber] = useState<number | null>(nextTaskNumber);
  const [hasLoggedAccess, setHasLoggedAccess] = useState(false);
  const sessionId = searchParams.get("sessionId") || "";

  const workerId = searchParams.get("workerId") || "";
  const assignmentId = searchParams.get("assignmentId") || "";
  const hitId = searchParams.get("hitId") || "";
  const turkSubmitTo = searchParams.get("turkSubmitTo") || "";
  const isPreview = assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE";
  const imageUrl = process.env.NEXT_PUBLIC_TODAY_IMAGE_URL_A || "";

  // taskNumberをfeedback APIから取得（workerId決定後、一度だけ実行）
  // useEffect(() => {
  //   if (!workerId) return;
  //   if (taskNumber !== null) return; // 既にクエリで受け取っている場合は取得しない
  //   const fetchTaskNumber = async () => {
  //     try {
  //       const response = await fetch(
  //         `/api/feedback?workerId=${encodeURIComponent(workerId)}`,
  //       );
  //       const data = await response.json();
  //       if (response.ok && data.nextTaskNumber) {
  //         setTaskNumber(data.nextTaskNumber);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch task number:", err);
  //     }
  //   };
  //   fetchTaskNumber();
  // }, [workerId, taskNumber]);

  console.log(taskNumber);

  useEffect(() => {
    if (hasLoggedAccess) return;
    if (!workerId) return;
    if (pathname !== "/task/answer") return;

    setHasLoggedAccess(true);

    const logAccess = async () => {
      try {
        const response = await fetch("/api/access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workerId, path: pathname }),
        });

        if (!response.ok) {
          console.error("Failed to record access", await response.text());
        }
      } catch (error) {
        console.error("Access logging error", error);
      }
    };

    logAccess();
  }, [hasLoggedAccess, pathname, workerId]);

  const handleBackToFeedback = () => {
    const params = searchParams.toString();
    const url = params ? `/task?${params}` : "/task";
    router.push(url);
  };

  const handleSubmit = async (
    caption: string,
    rtMs: number,
    selectedTaskNumber: number,
  ) => {
    setError(null);
    setWarning(null);
    try {
      // FBページ（/task）の滞在時間をクエリパラメータから取得
      const feedbackTimeMs = searchParams.get("feedbackTimeMs");
      const fbTime = feedbackTimeMs ? parseInt(feedbackTimeMs) : 0;

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId,
          assignmentId,
          hitId,
          caption,
          taskNumber: selectedTaskNumber,
          rtMs: fbTime, // FBページ（/task）の滞在時間のみを送信
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Submission failed");
        return;
      }

      // グループ情報を設定
      if (data.groupInfo) {
        setGroupInfo(data.groupInfo);
      }

      // 類似度が高い場合の警告（コードは発行される）
      if (data.isSimilar) {
        setWarning(
          "Your submission was flagged as similar to existing submissions, but has been recorded.",
        );
      }

      setCompletionCode(data.completionCode);
      setHasSubmitted(true);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  if (!workerId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Alert className="max-w-md border-amber-200 bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-900">
            Invalid task URL. Please access this task from Amazon Mechanical
            Turk.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // taskNumber取得中はローディング表示
  // if (taskNumber === null) {
  //   return <Loading />;
  // }

  if (hasSubmitted && completionCode) {
    const groupMessage = groupInfo ? getGroupMessage(groupInfo!) : null;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Thank You!
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Your caption has been submitted successfully.
            </p>

            {/* 類似度警告 */}
            {/* {warning && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-900">
                  {warning}
                </AlertDescription>
              </Alert>
            )} */}

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">
                Your completion code:
              </p>
              <p className="text-xl font-mono font-bold text-slate-900">
                {sessionId ? "CIXH42P7" : completionCode}
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Return to MTurk and press <strong>Submit</strong> to complete this
              HIT.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Website UI/UX Review
          </h1>
          <p className="text-slate-600">
            Interact with the site and report Concrete Improvements and User
            Psychology
          </p>
        </div>

        {isPreview && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Preview mode. Accept this HIT on MTurk to start the task.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-900">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <Instructions groupInfo={groupInfo} />
          {/* このボタンは、day1以降で表示 */}
          {/* <div className="mb-6">
            <Button
              onClick={handleBackToFeedback}
              className="mb-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feedback
            </Button>
          </div> */}
          <CaptionForm
            onSubmit={handleSubmit}
            disabled={isPreview}
            imageUrl={imageUrl}
            taskNumber={taskNumber}
          />
        </div>
      </div>
    </div>
  );
}
