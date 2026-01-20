"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageDisplay } from "./image-display";
import { countWords, isValidWordCount } from "@/lib/text-utils";
import Day0Page from "@/app/embedded-app/day0";
import Day1Page from "@/app/embedded-app/day1";
import Day2Page from "@/app/embedded-app/day2";
import Day3Page from "@/app/embedded-app/day3";
import Day4Page from "@/app/embedded-app/day4";
import Day5Page from "@/app/embedded-app/day5";
import Day6Page from "@/app/embedded-app/day6";
import Day7Page from "@/app/embedded-app/day7";
import { Loading } from "./loading";

interface CaptionFormProps {
  onSubmit: (caption: string, rtMs: number, taskNumber: number) => Promise<void>;
  disabled?: boolean;
  imageUrl?: string;
  pageStartTime?: number;
  taskNumber?: number | null;
}

const MIN_WORDS = 20;
const MAX_WORDS = 500;

// デフォルト値として Day2-7 からランダムに選ぶ
function getDefaultTaskNumber(): number {
  const defaultTasks = [2, 3, 4, 5, 6, 7];
  return defaultTasks[Math.floor(Math.random() * defaultTasks.length)];
}

export function CaptionForm({
  onSubmit,
  disabled,
  imageUrl,
  pageStartTime,
  taskNumber,
}: CaptionFormProps) {
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [showCaptionError, setShowCaptionError] = useState(false);
  const [interactions, setInteractions] = useState<any[]>([]);
  // taskNumber が null の場合のみ、デフォルト値を生成し、それ以降は変更しない
  const [defaultTask] = useState(() =>
    taskNumber !== null ? null : getDefaultTaskNumber()
  );

  // 埋め込みアプリからのpostMessageを受信
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // セキュリティ: 同一オリジンのみ許可（必要に応じて調整）
      if (event.origin !== window.location.origin) return;

      const { type, ...data } = event.data;

      if (type === "SCROLL" || type === "CLICK") {
        console.log("Interaction received:", type, data);
        setInteractions((prev) => [...prev, { type, ...data }]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // taskNumberに応じたコンポーネントを取得
  const getDayComponent = useCallback(() => {
    const dayNum = taskNumber || defaultTask;
    switch (dayNum) {
      case 0:
        return <Day0Page />;
      case 1:
        return <Day1Page />;
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
      default:
        return <Loading />;
    }
  }, [taskNumber, defaultTask]);

  const isValidLength = (text: string) =>
    isValidWordCount(text, MIN_WORDS, MAX_WORDS);
  const isTooShort = (text: string) =>
    countWords(text) > 0 && countWords(text) < MIN_WORDS;
  const canSubmit = isValidLength(caption) && !disabled && !isSubmitting;

  const handleCaptionBlur = () => {
    if (isTooShort(caption)) {
      setShowCaptionError(true);
    } else {
      setShowCaptionError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const rtMs = Date.now() - startTime;

      // インタラクションデータをログ出力（将来的にAPIに送信可能）
      console.log("Total interactions recorded:", interactions.length);
      console.log("Interaction data:", interactions);

      const usedTaskNumber = (taskNumber ?? defaultTask)!;
      await onSubmit(caption, rtMs, usedTaskNumber);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Write Your UI/UX Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 画像表示エリア */}
          <div className="space-y-2 border border-black">
            {/* <Label className="text-sm font-medium text-slate-700">Image</Label> */}
            {/* <ImageDisplay imageUrl={imageUrl} /> */}
            {getDayComponent()}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="caption"
                className="text-sm font-medium text-slate-700"
              >
                UI/UX Review
              </Label>
              <span
                className={`text-xs ${
                  isValidLength(caption) ? "text-green-600" : "text-slate-500"
                }`}
              >
                {countWords(caption)} / {MIN_WORDS} words
              </span>
            </div>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={handleCaptionBlur}
              placeholder="Write your UI/UX review of the upper website..."
              className={`min-h-[240px] resize-none focus:ring-slate-400 ${
                isTooShort(caption)
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-400"
              }`}
              disabled={disabled || isSubmitting}
            />
            {showCaptionError && (
              <p className="text-red-500 text-xs mt-1">
                Review needs at least {MIN_WORDS} words. Current:{" "}
                {countWords(caption)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
