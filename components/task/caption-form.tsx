"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageDisplay } from "./image-display";
import { countWords, isValidWordCount } from "@/lib/text-utils";
import Day1Page from "@/app/embedded-app/page";

interface CaptionFormProps {
  onSubmit: (caption: string, rtMs: number) => Promise<void>;
  disabled?: boolean;
  imageUrl?: string;
  pageStartTime?: number;
}

const MIN_WORDS = 20;
const MAX_WORDS = 500;

export function CaptionForm({
  onSubmit,
  disabled,
  imageUrl,
  pageStartTime,
}: CaptionFormProps) {
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [showCaptionError, setShowCaptionError] = useState(false);
  const [interactions, setInteractions] = useState<any[]>([]);

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

      await onSubmit(caption, rtMs);
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
            <Day1Page></Day1Page>
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
              maxLength={MAX_WORDS}
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
