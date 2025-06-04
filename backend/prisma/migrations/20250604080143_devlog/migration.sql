-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('HEART', 'LAUGH', 'LAMP');

-- CreateTable
CREATE TABLE "DevLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "description" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DevLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevLogReaction" (
    "id" TEXT NOT NULL,
    "devLogId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,

    CONSTRAINT "DevLogReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DevLog_userId_idx" ON "DevLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DevLogReaction_devLogId_userId_type_key" ON "DevLogReaction"("devLogId", "userId", "type");

-- AddForeignKey
ALTER TABLE "DevLog" ADD CONSTRAINT "DevLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevLogReaction" ADD CONSTRAINT "DevLogReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevLogReaction" ADD CONSTRAINT "DevLogReaction_devLogId_fkey" FOREIGN KEY ("devLogId") REFERENCES "DevLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
