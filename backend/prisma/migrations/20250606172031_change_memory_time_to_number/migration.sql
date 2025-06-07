/*
  Warnings:

  - The `memory` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `time` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "memory",
ADD COLUMN     "memory" INTEGER,
DROP COLUMN "time",
ADD COLUMN     "time" DOUBLE PRECISION;
