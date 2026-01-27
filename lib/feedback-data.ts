import { prisma } from "./prisma";
import { getCurrentDayIdx } from "./date-utils";

export interface HistogramData {
  bins: { score: number; count: number; isOwnBin: boolean }[];
  workerScore: number | null;
}

export interface GoalData {
  current: number;
  target: number;
  threshold: number;
}

export interface PreviousSubmissionData {
  feedback: string | null;
  scoreA: number | null;
  scoreB: number | null;
  scoreSum: number | null;
  dayIdx: number;
  taskNumber: number | null;
  nextTaskNumber: number | null;
}

export async function getWorkerCondition(
  workerId: string,
): Promise<number | null> {
  const workerResult = await prisma.$queryRaw<{ cond: number | null }[]>`
    SELECT cond
    FROM participants
    WHERE worker_id = ${workerId}
    LIMIT 1
  `;

  if (workerResult.length === 0) {
    return null;
  }

  return workerResult[0].cond;
}

export function isFirstDay(): boolean {
  const todayIdx = getCurrentDayIdx();
  const yesterdayIdx = todayIdx - 1;
  return yesterdayIdx < 0;
}

export async function getYesterdayHistogram(
  workerId: string,
): Promise<HistogramData | null> {
  console.log("Getting histogram for workerId:", workerId);

  // 初日の場合はnullを返す
  if (isFirstDay()) {
    console.log("First day detected, returning null for histogram");
    return null;
  }

  const yesterdayIdx = getCurrentDayIdx() - 1;
  console.log("Computed yesterday idx:", yesterdayIdx);

  // まず、このworkerのcondを取得
  const workerResult = await prisma.$queryRaw<{ cond: number | null }[]>`
    SELECT cond
    FROM participants
    WHERE worker_id = ${workerId}
    LIMIT 1
  `;

  console.log("Worker result for histogram:", workerResult);

  if (workerResult.length === 0 || workerResult[0].cond === null) {
    console.log("No worker found or cond is null for histogram");
    return null;
  }

  const workerCond = workerResult[0].cond;

  // 同じcondのparticipantsのスコア分布を取得
  const scoresRaw = await prisma.$queryRaw<{ score: number; count: bigint }[]>`
    SELECT sub.score_a as score, COUNT(*) as count
    FROM submissions sub
    INNER JOIN participants p ON sub.worker_id = p.worker_id
    WHERE sub.day_idx = ${yesterdayIdx} 
      AND sub.score_a IS NOT NULL 
      AND p.cond = ${workerCond}
    GROUP BY sub.score_a
    ORDER BY sub.score_a
  `;

  console.log("Scores raw result (group-specific):", scoresRaw);

  const workerScoreResult = await prisma.$queryRaw<{ score: number }[]>`
    SELECT sub.score_a as score
    FROM submissions sub
    WHERE sub.worker_id = ${workerId} AND sub.day_idx = ${yesterdayIdx} AND sub.score_a IS NOT NULL
    LIMIT 1
  `;

  const workerScore =
    workerScoreResult.length > 0 ? workerScoreResult[0].score : null;

  console.log("Worker score result:", workerScoreResult);
  console.log("Worker score:", workerScore);

  const bins = Array.from({ length: 11 }, (_, i) => {
    const scoreData = scoresRaw.find((s) => s.score === i);
    return {
      score: i,
      count: scoreData ? Number(scoreData.count) : 0,
      isOwnBin: workerScore === i,
    };
  });

  console.log("Final bins:", bins);

  return { bins, workerScore };
}

export async function getYesterdayGoalProgress(
  workerId: string,
): Promise<GoalData | null> {
  // 初日の場合はnullを返す
  if (isFirstDay()) {
    console.log("First day detected, returning null");
    return null;
  }

  console.log("Getting goal progress for workerId:", workerId);

  // まず、このworkerのcondを取得
  const workerResult = await prisma.$queryRaw<{ cond: number | null }[]>`
    SELECT cond
    FROM participants
    WHERE worker_id = ${workerId}
    LIMIT 1
  `;

  console.log("Worker result:", workerResult);

  if (workerResult.length === 0 || workerResult[0].cond === null) {
    console.log("No worker found or cond is null");
    return null;
  }

  const workerCond = workerResult[0].cond;
  const todayIdx = getCurrentDayIdx();
  const target = parseInt(process.env.GOAL_TARGET || "80", 10);
  const threshold = parseInt(process.env.GOAL_THRESHOLD || "7", 10);

  console.log(
    "Worker cond:",
    workerCond,
    "computed todayIdx:",
    todayIdx,
    "target:",
    target,
    "threshold:",
    threshold,
  );

  // submissionsテーブルから前日まで（当日は含まない）で、同じcondのparticipantsのscore_aをカウント
  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count
    FROM submissions sub
    INNER JOIN participants p ON sub.worker_id = p.worker_id
    WHERE sub.day_idx < ${todayIdx} 
      AND sub.score_a IS NOT NULL 
      AND sub.score_a >= ${threshold}
      AND p.cond = ${workerCond}
  `;

  console.log("Query result:", result);

  const current = result.length > 0 ? Number(result[0].count) : 0;

  console.log("Final goal data:", { current, target, threshold });

  return { current, target, threshold };
}

export async function getPreviousSubmission(
  workerId: string,
): Promise<PreviousSubmissionData | { nextTaskNumber: number | null }> {
  const todayIdx = getCurrentDayIdx();
  const yesterdayIdx = todayIdx - 1;

  // Get next task number (always calculated, even if no previous submission)
  let nextTaskNumber: number | null = null;
  try {
    const AVAILABLE_TASKS = [0, 1, 2, 3, 4, 5, 6, 7];

    // Get completed task numbers
    const completedSubmissions = await prisma.submission.findMany({
      where: {
        workerId,
        taskNumber: { not: null },
      },
      select: {
        taskNumber: true,
      },
    });

    const completedTasks = completedSubmissions
      .map((s) => s.taskNumber)
      .filter((t) => t !== null) as number[];

    // Find available tasks
    const availableTasks = AVAILABLE_TASKS.filter(
      (task) => !completedTasks.includes(task),
    );

    // Select randomly from available tasks
    if (availableTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTasks.length);
      nextTaskNumber = availableTasks[randomIndex];
    }
  } catch (err) {
    console.log("Could not get next task number:", err);
  }

  if (yesterdayIdx < 0) {
    console.log("No previous day available for worker", workerId);
    return { nextTaskNumber };
  }

  let submission = await prisma.submission.findUnique({
    where: {
      workerId_dayIdx: {
        workerId,
        dayIdx: yesterdayIdx,
      },
    },
    select: {
      feedback: true,
      scoreA: true,
      scoreB: true,
      dayIdx: true,
      taskNumber: true,
    },
  });

  if (!submission) {
    submission = await prisma.submission.findFirst({
      where: {
        workerId,
        dayIdx: {
          lt: todayIdx,
        },
      },
      orderBy: {
        dayIdx: "desc",
      },
      select: {
        feedback: true,
        scoreA: true,
        scoreB: true,
        dayIdx: true,
        taskNumber: true,
      },
    });
  }

  if (!submission) {
    console.log(
      "No previous submission found for",
      workerId,
      "before",
      todayIdx,
    );
    return { nextTaskNumber };
  }

  const hasAnyScore = submission.scoreA !== null || submission.scoreB !== null;
  const scoreSum = hasAnyScore
    ? (submission.scoreA ?? 0) + (submission.scoreB ?? 0)
    : null;

  return {
    feedback: submission.feedback,
    scoreA: submission.scoreA,
    scoreB: submission.scoreB,
    scoreSum,
    dayIdx: submission.dayIdx,
    taskNumber: submission.taskNumber ?? null,
    nextTaskNumber,
  };
}
