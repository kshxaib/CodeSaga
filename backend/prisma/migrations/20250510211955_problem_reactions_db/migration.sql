/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProblemReaction` table. All the data in the column will be lost.
  - You are about to drop the column `dislikeCount` on the `ProblemReaction` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `ProblemReaction` table. All the data in the column will be lost.
  - You are about to drop the column `ratingCount` on the `ProblemReaction` table. All the data in the column will be lost.
  - You are about to drop the column `totalRating` on the `ProblemReaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProblemReaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[problemId,userId]` on the table `ProblemReaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isLike` to the `ProblemReaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ProblemReaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProblemReaction" DROP CONSTRAINT "ProblemReaction_problemId_fkey";

-- DropIndex
DROP INDEX "ProblemReaction_problemId_key";

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProblemReaction" DROP COLUMN "createdAt",
DROP COLUMN "dislikeCount",
DROP COLUMN "likeCount",
DROP COLUMN "ratingCount",
DROP COLUMN "totalRating",
DROP COLUMN "updatedAt",
ADD COLUMN     "isLike" BOOLEAN NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProblemReaction_problemId_userId_key" ON "ProblemReaction"("problemId", "userId");
