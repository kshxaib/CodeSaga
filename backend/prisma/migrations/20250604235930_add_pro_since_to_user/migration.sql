/*
  Warnings:

  - The values [CANCELLED] on the enum `InvitationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isRead` on the `Notification` table. All the data in the column will be lost.
  - Changed the type of `type` on the `DevLogReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvitationStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
ALTER TYPE "InvitationStatus" RENAME TO "InvitationStatus_old";
ALTER TYPE "InvitationStatus_new" RENAME TO "InvitationStatus";
DROP TYPE "InvitationStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "DevLogReaction" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "isRead";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "proSince" TIMESTAMP(3);

-- DropEnum
DROP TYPE "ReactionType";

-- CreateIndex
CREATE UNIQUE INDEX "DevLogReaction_devLogId_userId_type_key" ON "DevLogReaction"("devLogId", "userId", "type");
