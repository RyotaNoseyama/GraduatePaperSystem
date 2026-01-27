import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { verifyAdminToken } from "@/lib/admin-auth";
import {
  buildEvaluationPrompt,
  getPromptTemplateForCond,
} from "@/lib/evaluation-prompt";

export const dynamic = "force-dynamic";

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
};

/**
 * 指定された dayIdx の submission を一括で OpenAI に送信
 */
export async function POST(request: NextRequest) {
  try {
    const adminPayload = await verifyAdminToken(request);
    if (!adminPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dayIdx, prompt } = body as { dayIdx?: number; prompt?: string };

    if (typeof dayIdx !== "number" || Number.isNaN(dayIdx)) {
      return NextResponse.json(
        { error: "dayIdx (number) is required" },
        { status: 400 },
      );
    }

    type SubmissionForAI = {
      id: string;
      workerId: string;
      dayIdx: number;
      answer: string;
      taskNumber: number | null;
      participant: {
        cond: number | null;
      } | null;
    };

    // 指定日の submissions を取得（必要フィールドだけ select）
    const submissions: SubmissionForAI[] = await prisma.submission.findMany({
      where: { dayIdx },
      select: {
        id: true,
        workerId: true,
        dayIdx: true,
        answer: true,
        taskNumber: true,
        participant: {
          select: {
            cond: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    if (submissions.length === 0) {
      return NextResponse.json(
        { success: true, dayIdx, totalProcessed: 0, results: [] },
        { status: 200 },
      );
    }

    const customPrompt = typeof prompt === "string" ? prompt.trim() : "";
    const hasCustomPrompt = customPrompt.length > 0;

    const openai = getOpenAI();

    const results = await Promise.all(
      submissions.map(async (submission) => {
        try {
          const templateName = getPromptTemplateForCond(
            submission.participant?.cond,
          );
          const systemPrompt = hasCustomPrompt
            ? customPrompt
            : await buildEvaluationPrompt({
                taskNumber: submission.taskNumber ?? null,
                workerAnswer: submission.answer,
                templateName,
              });
          const userMessageContent = submission.answer;

          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessageContent },
            ],
            temperature: 0.2,
            max_tokens: 1000,
          });

          const aiResponse = completion.choices[0]?.message?.content || "";
          return {
            submissionId: submission.id,
            workerId: submission.workerId,
            dayIdx: submission.dayIdx,
            success: true,
            openaiResponse: aiResponse,
            usage: completion.usage,
          };
        } catch (error) {
          return {
            submissionId: submission.id,
            workerId: submission.workerId,
            dayIdx: submission.dayIdx,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    return NextResponse.json(
      { success: true, dayIdx, totalProcessed: results.length, results },
      { status: 200 },
    );
  } catch (error) {
    console.error("OpenAI API day-batch error:", error);
    return NextResponse.json(
      {
        error: "Failed to process day batch with OpenAI API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
