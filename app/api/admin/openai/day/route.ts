import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { verifyAdminToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // 指定日の submissions を取得
    const submissions = await prisma.submission.findMany({
      where: { dayIdx },
      include: { participant: true },
      orderBy: { submittedAt: "desc" },
    });

    if (submissions.length === 0) {
      return NextResponse.json(
        { success: true, dayIdx, totalProcessed: 0, results: [] },
        { status: 200 },
      );
    }

    const systemPrompt =
      prompt ||
      `以下の回答を評価してください。\n回答の質、明確さ、完成度を1-10のスケールで評価し、改善点を提案してください。`;

    const results = await Promise.all(
      submissions.map(async (submission) => {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: submission.answer },
            ],
            temperature: 0.7,
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
