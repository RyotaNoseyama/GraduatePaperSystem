import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type EvaluationPayload = {
  submissionId: string;
  scoreA?: number | null;
  scoreB?: number | null;
  feedback?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const adminPayload = await verifyAdminToken(request);
    if (!adminPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { evaluations } = body as { evaluations?: EvaluationPayload[] };

    if (!Array.isArray(evaluations) || evaluations.length === 0) {
      return NextResponse.json(
        { error: "evaluations array is required" },
        { status: 400 },
      );
    }

    const results: Array<{
      submissionId: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const evaluation of evaluations) {
      const { submissionId, scoreA, scoreB, feedback } = evaluation;

      if (!submissionId) {
        results.push({
          submissionId: "",
          success: false,
          error: "submissionId is required",
        });
        continue;
      }

      try {
        await prisma.submission.update({
          where: { id: submissionId },
          data: {
            scoreA: typeof scoreA === "number" ? scoreA : null,
            scoreB: typeof scoreB === "number" ? scoreB : null,
            feedback: feedback ?? null,
          },
        });
        results.push({ submissionId, success: true });
      } catch (error) {
        results.push({
          submissionId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter((result) => result.success).length;

    return NextResponse.json({
      success: true,
      total: results.length,
      successCount,
      results,
    });
  } catch (error) {
    console.error("Persist submission scores error:", error);
    return NextResponse.json(
      {
        error: "Failed to persist submission scores",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
