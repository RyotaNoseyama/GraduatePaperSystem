import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const toNullableInt = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  return Math.round(numericValue);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, scoreA, scoreB, feedback } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId is required" },
        { status: 400 },
      );
    }

    // Update the submission with scores and feedback
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        scoreA: toNullableInt(scoreA),
        scoreB: toNullableInt(scoreB),
        feedback: typeof feedback === "string" ? feedback : null,
      },
    });

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 },
    );
  }
}
