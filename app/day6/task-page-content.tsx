"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Instructions } from "@/components/task/instructions";
import { CaptionForm } from "@/components/task/caption-form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { GroupInfo, getGroupMessage } from "@/lib/group-utils";
import { Button } from "@/components/ui/button";

export function TaskPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [completionCode, setCompletionCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);

  const workerId = searchParams.get("workerId") || "";
  const assignmentId = searchParams.get("assignmentId") || "";
  const hitId = searchParams.get("hitId") || "";
  const turkSubmitTo = searchParams.get("turkSubmitTo") || "";
  const isPreview = assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE";
  const imageUrl = process.env.NEXT_PUBLIC_TODAY_IMAGE_URL_A || "";

  const handleBackToFeedback = () => {
    const params = searchParams.toString();
    const url = params ? `/day6?${params}` : "/day6";
    router.push(url);
  };

  const handleSubmit = async (caption: string, rtMs: number) => {
    setError(null);
    setWarning(null);
    try {
      // FBページ（/day6）の滞在時間をクエリパラメータから取得
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
          rtMs,
          fbTimeMs: fbTime,
          dayIdx: 6,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setWarning(data.warning || "An issue occurred during submission");
        } else {
          setError(data.error || "Failed to submit");
        }
        return;
      }

      setCompletionCode(data.completionCode);
      setHasSubmitted(true);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    }
  };

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await fetch(
          `/api/submissions?workerId=${encodeURIComponent(workerId)}`,
        );
        const data = await response.json();
        if (data.groupInfo) {
          setGroupInfo(data.groupInfo);
        }
      } catch (err) {
        console.error("Failed to fetch group info:", err);
      }
    };

    if (workerId) {
      fetchGroupInfo();
    }
  }, [workerId]);

  const params = searchParams.toString();

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Day 6 - Answer Page</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToFeedback}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feedback
        </Button>
      </div>

      {hasSubmitted ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-2">
                  Submission Successful!
                </h3>
                <p className="text-green-800 mb-4">
                  Your answer has been submitted successfully.
                </p>
                <div className="bg-white p-3 rounded border border-green-300 mb-4">
                  <p className="text-sm font-mono text-gray-700">
                    Completion Code: <span className="font-bold">{completionCode}</span>
                  </p>
                </div>
                <p className="text-sm text-green-700">
                  Please copy this code and return to MTurk to submit your assignment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {warning && (
            <Alert className="border-yellow-300 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                {warning}
              </AlertDescription>
            </Alert>
          )}

          {groupInfo && (
            <Alert className="border-blue-300 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {getGroupMessage(groupInfo)}
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="pt-6">
              <Instructions />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <CaptionForm imageUrl={imageUrl} onSubmit={handleSubmit} />
            </CardContent>
          </Card>

          {isPreview && (
            <Alert variant="default" className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                You are previewing this task. You will need to accept the HIT to submit your
                answer.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
