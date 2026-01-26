"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Day0Page from "@/app/embedded-app/day0";
import Day1Page from "@/app/embedded-app/day1";
import Day2Page from "@/app/embedded-app/day2";
import Day3Page from "@/app/embedded-app/day3";
import Day4Page from "@/app/embedded-app/day4";
import Day5Page from "@/app/embedded-app/day5";
import Day6Page from "@/app/embedded-app/day6";
import Day7Page from "@/app/embedded-app/day7";

type PreviousSubmission = {
  feedback: string | null;
  scoreA: number | null;
  scoreB: number | null;
  scoreSum: number | null;
  dayIdx: number;
  taskNumber: number | null;
};

interface FeedbackPageProps {
  dayNumber?: number;
}

export function FeedbackPage({ dayNumber = 1 }: FeedbackPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedbackStartTime] = useState(Date.now()); // FBページ開始時刻
  const [previousSubmission, setPreviousSubmission] =
    useState<PreviousSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskNumber, setTaskNumber] = useState<number | null>(null);
  const [nextTaskNumber, setNextTaskNumber] = useState<number | null>(null);
  const [workerCondition, setWorkerCondition] = useState<number | null>(null);

  const workerId = searchParams.get("workerId") || "";

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!workerId) {
        setError(
          "workerId is missing. Please access the task link from MTurk.",
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/feedback?workerId=${encodeURIComponent(workerId)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load feedback");
          setIsLoading(false);
          return;
        }

        console.log("Fetched feedback data:", data);

        setPreviousSubmission(data.previousSubmission ?? null);
        setTaskNumber(data.taskNumber ?? null);
        setNextTaskNumber(data.nextTaskNumber ?? null);
        setWorkerCondition(
          typeof data.workerCondition === "number"
            ? data.workerCondition
            : null,
        );
      } catch (err) {
        setError("Network error while loading feedback.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [workerId]);

  const scoreLabel = previousSubmission
    ? previousSubmission.scoreSum !== null
      ? previousSubmission.scoreSum
      : (previousSubmission.scoreA ?? 0) + (previousSubmission.scoreB ?? 0) > 0
        ? (previousSubmission.scoreA ?? 0) + (previousSubmission.scoreB ?? 0)
        : "--"
    : "--";

  const thankYouMessage =
    "Thank you for your previous submission. We look forward to working with you again today.";
  const shouldShowThankYou = !isLoading && workerCondition === 2;
  const shouldHideDetails = !isLoading && workerCondition === 2;

  // Select the appropriate page component based on taskNumber
  const getDayComponent = () => {
    console.log("Rendering day component for taskNumber:", taskNumber);
    const dayNum = taskNumber;
    switch (dayNum) {
      case 0:
        return <Day0Page />;
      case 2:
        return <Day2Page />;
      case 3:
        return <Day3Page />;
      case 4:
        return <Day4Page />;
      case 5:
        return <Day5Page />;
      case 6:
        return <Day6Page />;
      case 7:
        return <Day7Page />;
      case 1:
        return <Day1Page />;
      default:
        return <></>;
    }
  };

  const handleGoToAnswer = () => {
    // FBページの滞在時間を計算
    const feedbackTimeMs = Date.now() - feedbackStartTime;

    // 現在のクエリパラメータを保持して遷移
    const params = searchParams.toString();
    const separator = params ? "&" : "?";
    const url = `/task/answer${params ? "?" + params : ""}${separator}feedbackTimeMs=${feedbackTimeMs}&nextTaskNumber=${nextTaskNumber}`;
    router.push(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Previous Day&apos;s Feedback</h1>

      <div className="grid gap-6">
        {/* Previous day's website display */}
        {!shouldHideDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Previous Day&apos;s Website</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full  border rounded-lg overflow-hidden">
                {getDayComponent()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Score and feedback display */}
        <Card>
          <CardHeader>
            {!shouldHideDetails && (
              <CardTitle>Evaluation of Your Response</CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!shouldHideDetails && !isLoading && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Score (out of 14 points)
                  </h3>
                  <div className="text-4xl font-bold text-blue-600">
                    {typeof scoreLabel === "number" ? scoreLabel + 2 : scoreLabel}
                  </div>
                  {!previousSubmission && (
                    <p className="text-sm text-slate-600 mt-1">
                      No score available yet. Please check back after your first
                      submission.
                    </p>
                  )}
                </div>
              )}
              {!shouldHideDetails && isLoading && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Score (out of 14 points)
                  </h3>
                  <div className="text-sm text-gray-500 italic">
                    Loading score...
                  </div>
                </div>
              )}
              {!shouldHideDetails && error && !isLoading && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}

              <div>
                <h3 className="font-semibold mb-2">Feedback</h3>
                <div className="bg-gray-50 p-4 rounded-lg min-h-[150px]">
                  {isLoading && (
                    <p className="text-gray-500 italic">Loading feedback...</p>
                  )}
                  {shouldShowThankYou && (
                    <p className="text-gray-800">{thankYouMessage}</p>
                  )}
                  {!isLoading &&
                    workerCondition !== 2 &&
                    previousSubmission?.feedback && (
                      <p className="text-gray-800 whitespace-pre-line">
                        {previousSubmission.feedback}
                      </p>
                    )}
                  {!isLoading &&
                    workerCondition !== 2 &&
                    !previousSubmission?.feedback && (
                      <p className="text-gray-500 italic">
                        Feedback is not available yet.
                      </p>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button to proceed to today's answer page */}
        <div className="flex justify-center">
          <Button
            onClick={handleGoToAnswer}
            size="lg"
            className="w-full max-w-md"
            disabled={isLoading}
          >
            Proceed to Today&apos;s Answer Page
          </Button>
        </div>
      </div>
    </div>
  );
}
