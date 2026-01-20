-- DropForeignKey
ALTER TABLE "scores" DROP CONSTRAINT "scores_submission_id_fkey";
ALTER TABLE "scores" DROP CONSTRAINT "scores_worker_id_fkey";

-- DropTable
DROP TABLE "scores";

-- AlterTable
ALTER TABLE "submissions" RENAME COLUMN "score" TO "score_b";
