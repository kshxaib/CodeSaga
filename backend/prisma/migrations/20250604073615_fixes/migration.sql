/*
  Warnings:

  - You are about to drop the column `badges` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followerCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProblemCollaboration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProblemInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollaborationParticipants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followingId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemCollaboration" DROP CONSTRAINT "ProblemCollaboration_initiatorId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemCollaboration" DROP CONSTRAINT "ProblemCollaboration_problemId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemInvitation" DROP CONSTRAINT "ProblemInvitation_problemId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemInvitation" DROP CONSTRAINT "ProblemInvitation_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemInvitation" DROP CONSTRAINT "ProblemInvitation_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_CollaborationParticipants" DROP CONSTRAINT "_CollaborationParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollaborationParticipants" DROP CONSTRAINT "_CollaborationParticipants_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "badges",
DROP COLUMN "followerCount",
DROP COLUMN "followingCount",
ALTER COLUMN "image" SET DEFAULT 'https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg';

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "Follow";

-- DropTable
DROP TABLE "ProblemCollaboration";

-- DropTable
DROP TABLE "ProblemInvitation";

-- DropTable
DROP TABLE "_CollaborationParticipants";
