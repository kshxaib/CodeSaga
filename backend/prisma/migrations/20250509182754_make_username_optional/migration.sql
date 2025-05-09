/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "forgotPasswordOtp" TEXT,
ADD COLUMN     "forgotPasswordOtpExpiry" TIMESTAMP(3),
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "image" SET DEFAULT 'https://placehold.co/600x400';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
