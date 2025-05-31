-- DropForeignKey
ALTER TABLE "ProblemInvitation" DROP CONSTRAINT "ProblemInvitation_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemInvitation" DROP CONSTRAINT "ProblemInvitation_senderId_fkey";

-- AlterTable
ALTER TABLE "ProblemCollaboration" ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 5;

-- AddForeignKey
ALTER TABLE "ProblemInvitation" ADD CONSTRAINT "ProblemInvitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemInvitation" ADD CONSTRAINT "ProblemInvitation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
