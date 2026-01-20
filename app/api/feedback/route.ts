import { NextRequest, NextResponse } from "next/server";
import { getPreviousSubmission } from "@/lib/feedback-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId") || "";

    if (!workerId) {
      return NextResponse.json(
        { error: "workerId is required" },
        { status: 400 },
      );
    }

    const previousSubmission = await getPreviousSubmission(workerId);

    // previousSubmission can be either full data or just { nextTaskNumber }
    const taskNumber =
      "taskNumber" in previousSubmission ? previousSubmission.taskNumber : null;
    const nextTaskNumber = previousSubmission.nextTaskNumber ?? null;

    console.log("API feedback data:", {
      previousSubmission,
      taskNumber,
      nextTaskNumber,
    });

    return NextResponse.json({
      previousSubmission,
      taskNumber,
      nextTaskNumber,
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to load feedback data" },
      { status: 500 },
    );
  }
}
