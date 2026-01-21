-- CreateTable
CREATE TABLE "access" (
    "id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "access_worker_id_idx" ON "access"("worker_id");
