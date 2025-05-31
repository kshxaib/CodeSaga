-- CreateTable
CREATE TABLE "ProblemCollaboration" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "currentCode" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemCollaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CollaborationParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CollaborationParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemCollaboration_problemId_initiatorId_key" ON "ProblemCollaboration"("problemId", "initiatorId");

-- CreateIndex
CREATE INDEX "_CollaborationParticipants_B_index" ON "_CollaborationParticipants"("B");

-- AddForeignKey
ALTER TABLE "ProblemCollaboration" ADD CONSTRAINT "ProblemCollaboration_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemCollaboration" ADD CONSTRAINT "ProblemCollaboration_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaborationParticipants" ADD CONSTRAINT "_CollaborationParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "ProblemCollaboration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaborationParticipants" ADD CONSTRAINT "_CollaborationParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
