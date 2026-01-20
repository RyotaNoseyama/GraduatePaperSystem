-- Add `task_number` column to `submissions` table
-- This column stores the task number for each submission

ALTER TABLE "submissions"
ADD COLUMN "task_number" INTEGER;
