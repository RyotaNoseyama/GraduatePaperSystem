-- AlterTable
ALTER TABLE "submissions"
ADD COLUMN "answer" TEXT NOT NULL DEFAULT '',
DROP COLUMN "caption_a";
