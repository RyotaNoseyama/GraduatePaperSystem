import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { verifyAdminToken } from "@/lib/admin-auth";
import {
  buildEvaluationPrompt,
  getPromptTemplateForCond,
} from "@/lib/evaluation-prompt";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * submissionのanswerをOpenAI APIに送信して評価を取得
 */
export async function POST(request: NextRequest) {
  try {
    // 管理者認証チェック
    const adminPayload = await verifyAdminToken(request);
    if (!adminPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, prompt } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId is required" },
        { status: 400 },
      );
    }

    // submissionを取得
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        participant: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    const templateName = getPromptTemplateForCond(submission.participant?.cond);
    const customPrompt = typeof prompt === "string" ? prompt.trim() : "";
    const hasCustomPrompt = customPrompt.length > 0;
    const systemPrompt = hasCustomPrompt
      ? customPrompt
      : await buildEvaluationPrompt({
          taskNumber: submission.taskNumber ?? null,
          workerAnswer: submission.answer,
          templateName,
        });
    const userMessageContent = submission.answer;

    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessageContent,
        },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        workerId: submission.workerId,
        dayIdx: submission.dayIdx,
        answer: submission.answer,
        submittedAt: submission.submittedAt,
      },
      openaiResponse: aiResponse,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process with OpenAI API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * 複数のsubmissionを一括でOpenAI APIに送信
 */
export async function PUT(request: NextRequest) {
  try {
    // 管理者認証チェック
    const adminPayload = await verifyAdminToken(request);
    if (!adminPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { submissionIds, prompt } = body;

    if (
      !submissionIds ||
      !Array.isArray(submissionIds) ||
      submissionIds.length === 0
    ) {
      return NextResponse.json(
        { error: "submissionIds array is required" },
        { status: 400 },
      );
    }

    // submissionsを取得
    const submissions = await prisma.submission.findMany({
      where: {
        id: { in: submissionIds },
      },
      include: {
        participant: true,
      },
    });

    if (submissions.length === 0) {
      return NextResponse.json(
        { error: "No submissions found" },
        { status: 404 },
      );
    }

    const customPrompt = typeof prompt === "string" ? prompt.trim() : "";
    const hasCustomPrompt = customPrompt.length > 0;

    // 各submissionをOpenAI APIで処理
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
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userMessageContent,
              },
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

    return NextResponse.json({
      success: true,
      totalProcessed: results.length,
      results,
    });
  } catch (error) {
    console.error("OpenAI API batch error:", error);
    return NextResponse.json(
      {
        error: "Failed to process batch with OpenAI API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
