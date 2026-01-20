"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedbackStartTime] = useState(Date.now()); // FBページ開始時刻

  const handleGoToAnswer = () => {
    // FBページの滞在時間を計算
    const feedbackTimeMs = Date.now() - feedbackStartTime;
    
    // 現在のクエリパラメータを保持して遷移
    const params = searchParams.toString();
    const separator = params ? "&" : "?";
    const url = `/task/answer${params ? "?" + params : ""}${separator}feedbackTimeMs=${feedbackTimeMs}`;
    router.push(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Previous Day&apos;s Feedback</h1>
      
      <div className="grid gap-6">
        {/* Previous day's website display */}
        <Card>
          <CardHeader>
            <CardTitle>Previous Day&apos;s Website</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[500px] border rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                title="Previous Day's Website"
                // src will be set later
              />
            </div>
          </CardContent>
        </Card>

        {/* Score and feedback display */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation of Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Score</h3>
                <div className="text-4xl font-bold text-blue-600">
                  {/* Score will be fetched later */}
                  --
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Feedback</h3>
                <div className="bg-gray-50 p-4 rounded-lg min-h-[150px]">
                  {/* Feedback will be fetched later */}
                  <p className="text-gray-500 italic">Feedback will be displayed later</p>
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
          >
            Proceed to Today&apos;s Answer Page
          </Button>
        </div>
      </div>
    </div>
  );
}
