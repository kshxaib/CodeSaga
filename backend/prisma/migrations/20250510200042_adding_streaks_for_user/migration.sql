-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastSolvedDate" TIMESTAMP(3),
ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0;
