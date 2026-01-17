-- CreateTable
CREATE TABLE "participants" (
    "worker_id" TEXT NOT NULL,
    "cond" INTEGER,
    "participant_order" INTEGER,
    "tz" TEXT,
    "consent_at" TIMESTAMP(3),

    CONSTRAINT "participants_pkey" PRIMARY KEY ("worker_id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "date_et" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "day_idx" INTEGER NOT NULL,
    "caption_a" TEXT NOT NULL,
    "score_a" INTEGER,
    "score" INTEGER,
    "rt_ms" INTEGER,
    "completion_code" TEXT,
    "submitted_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "is_7plus" BOOLEAN NOT NULL DEFAULT false,
    "scored_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scorer" TEXT,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_goals" (
    "id" TEXT NOT NULL,
    "day_idx" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "days_idx_key" ON "days"("idx");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_worker_id_day_idx_key" ON "submissions"("worker_id", "day_idx");

-- CreateIndex
CREATE UNIQUE INDEX "scores_submission_id_key" ON "scores"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_goals_day_idx_key" ON "group_goals"("day_idx");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "participants"("worker_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "participants"("worker_id") ON DELETE RESTRICT ON UPDATE CASCADE;
