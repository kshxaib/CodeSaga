/*
  Warnings:

  - Added the required column `paymentId` to the `PlaylistPurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentOrderId` to the `PlaylistPurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentSignature` to the `PlaylistPurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlaylistPurchase" ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "paymentOrderId" TEXT NOT NULL,
ADD COLUMN     "paymentSignature" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Problem" ALTER COLUMN "askedIn" SET DEFAULT ARRAY[]::TEXT[];
