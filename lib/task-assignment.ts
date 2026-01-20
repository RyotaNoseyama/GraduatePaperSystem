import { prisma } from "@/lib/prisma";

// タスク番号は 1-7
const AVAILABLE_TASKS = [1, 2, 3, 4, 5, 6, 7];

/**
 * 指定された参加者が既に完了したタスク番号の一覧を取得
 */
async function getCompletedTaskNumbers(workerId: string): Promise<number[]> {
  const submissions = await prisma.submission.findMany({
    where: {
      workerId,
      taskNumber: { not: null },
    },
    select: {
      taskNumber: true,
    },
  });

  return submissions
    .map((s) => s.taskNumber)
    .filter((t) => t !== null) as number[];
}

/**
 * 指定された参加者が未完了のタスク番号一覧を取得
 */
export async function getAvailableTaskNumbers(
  workerId: string,
): Promise<number[]> {
  const completedTasks = await getCompletedTaskNumbers(workerId);
  return AVAILABLE_TASKS.filter((task) => !completedTasks.includes(task));
}

/**
 * 指定された参加者に割り当てるべき次のタスク番号を取得
 * 未完了のタスクの中からランダムに1つ選択
 */
export async function getNextTaskNumber(workerId: string): Promise<number> {
  const availableTasks = await getAvailableTaskNumbers(workerId);

  if (availableTasks.length === 0) {
    // すべてのタスクを完了した場合（通常は起こらない）
    throw new Error("All tasks have been completed");
  }

  // 利用可能なタスクの中からランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * availableTasks.length);
  return availableTasks[randomIndex];
}

/**
 * 指定された参加者と日付に対して、既に タスク番号が割り当てられているかチェック
 */
export async function getTaskNumberForDay(
  workerId: string,
  dayIdx: number,
): Promise<number | null> {
  const submission = await prisma.submission.findUnique({
    where: {
      workerId_dayIdx: {
        workerId,
        dayIdx,
      },
    },
    select: {
      taskNumber: true,
    },
  });

  return submission?.taskNumber || null;
}
