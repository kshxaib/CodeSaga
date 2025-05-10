-- CreateTable
CREATE TABLE "ProblemReaction" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "dislikeCount" INTEGER NOT NULL DEFAULT 0,
    "totalRating" INTEGER NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemReaction_problemId_key" ON "ProblemReaction"("problemId");

-- AddForeignKey
ALTER TABLE "ProblemReaction" ADD CONSTRAINT "ProblemReaction_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
