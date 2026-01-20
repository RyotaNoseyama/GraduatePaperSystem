-- Add `feedback` column to `submissions` table
-- This column stores optional text feedback for each submission

ALTER TABLE "submissions"
ADD COLUMN "feedback" TEXT;
