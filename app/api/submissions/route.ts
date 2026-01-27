import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDayIdx, generateCompletionCode } from "@/lib/date-utils";
import { calculateWERSimilarity } from "@/lib/wer-similarity";
import { isValidWordCount } from "@/lib/text-utils";
import { verifyAdminToken } from "@/lib/admin-auth";
import {
  getNextTaskNumber,
  getAvailableTaskNumbers,
} from "@/lib/task-assignment";

const MIN_WORDS = 10;
const MAX_WORDS = 500;
const SIMILARITY_THRESHOLD = 0.8; // 8割の類似度閾値

export const dynamic = "force-dynamic";

/**
 * Get all submissions (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // 管理者認証チェック
    const adminPayload = await verifyAdminToken(request);
    if (!adminPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dayIdx = searchParams.get("dayIdx");
    const workerId = searchParams.get("workerId");
    const condParam = searchParams.get("cond");

    const where: Record<string, unknown> = {};

    const defaultCond = 1;
    let condValue = defaultCond;
    if (condParam !== null) {
      const parsedCond = Number.parseInt(condParam, 10);
      if (!Number.isNaN(parsedCond)) {
        condValue = parsedCond;
      }
    }

    where.participant = {
      cond: condValue,
    };
    if (dayIdx) {
      where.dayIdx = parseInt(dayIdx);
    }
    if (workerId) {
      where.workerId = workerId;
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        participant: true,
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length,
    });
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workerId, assignmentId, hitId, caption, rtMs, taskNumber } = body;

    if (assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE") {
      return NextResponse.json(
        { error: "Cannot submit in preview mode" },
        { status: 400 },
      );
    }

    if (!workerId || !caption) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const trimmedCaption = caption.trim();

    if (!isValidWordCount(trimmedCaption, MIN_WORDS, MAX_WORDS)) {
      return NextResponse.json(
        {
          error: `Review must be between ${MIN_WORDS} and ${MAX_WORDS} words`,
        },
        { status: 400 },
      );
    }

    const currentDayIdx = getCurrentDayIdx();

    // その日の全ての提出済みキャプションを取得して類似度チェック
    const todaySubmissions = await prisma.submission.findMany({
      where: {
        dayIdx: currentDayIdx,
      },
      select: {
        answer: true,
        workerId: true,
      },
    });

    // 新しいキャプションと既存のキャプションの類似度をチェック
    let isSimilar = false;
    for (const existingSubmission of todaySubmissions) {
      if (!existingSubmission.answer) continue;

      const similarity = calculateWERSimilarity(
        trimmedCaption,
        existingSubmission.answer,
      );

      if (similarity >= SIMILARITY_THRESHOLD) {
        console.warn(
          `High similarity detected: ${similarity.toFixed(
            3,
          )} between ${workerId} and ${existingSubmission.workerId}`,
        );
        isSimilar = true;
        break;
      }
    }

    // participantテーブルに登録（類似度に応じてcondを設定）
    let participant = await prisma.participant.findUnique({
      where: { workerId: workerId },
    });

    if (!participant) {
      // 新しい参加者の場合、順序とグループを決定
      const participantCount = await prisma.participant.count();
      const newOrder = participantCount + 1;

      // 類似度が高い場合はcond=0、それ以外は1or2
      let groupCond: number;
      if (isSimilar) {
        groupCond = 0; // 類似度が高い場合
      } else {
        groupCond = (newOrder % 2) + 1; // 1 or 2 を交互に割り当て
      }

      participant = await prisma.participant.create({
        data: {
          workerId: workerId,
          participantOrder: newOrder,
          cond: groupCond,
        },
      });
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        workerId_dayIdx: {
          workerId: workerId,
          dayIdx: currentDayIdx,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You have already submitted for today" },
        { status: 400 },
      );
    }

    // コンプリーションコードを生成（類似度に関わらず生成）
    const completionCode = generateCompletionCode();

    // タスク番号を決定: クライアント指定があればそれを検証して使用、無ければサーバーで割り当て
    let resolvedTaskNumber: number;
    if (typeof taskNumber === "number") {
      const available = await getAvailableTaskNumbers(workerId);
      console.log("Available task numbers for", workerId, ":", available);
      console.log("Requested task number:", taskNumber);
      if (!available.includes(taskNumber)) {
        return NextResponse.json(
          { error: "Invalid or already used task number" },
          { status: 400 },
        );
      }
      resolvedTaskNumber = taskNumber;
    } else {
      resolvedTaskNumber = await getNextTaskNumber(workerId);
    }

    const submission = await prisma.submission.create({
      data: {
        workerId: workerId,
        dayIdx: currentDayIdx,
        taskNumber: resolvedTaskNumber,
        answer: trimmedCaption,
        rtMs: rtMs || null,
        completionCode: "C92OJM9L", // ここ変更
      },
    });

    return NextResponse.json({
      ok: true,
      completionCode,
      submissionId: submission.id,
      groupInfo: {
        cond: participant.cond,
        participantOrder: participant.participantOrder,
      },
      isSimilar: isSimilar, // 類似度が高いかどうかの情報を追加
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}
