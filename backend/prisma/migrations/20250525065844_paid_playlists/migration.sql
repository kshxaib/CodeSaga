-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "PlaylistPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistPurchase_userId_playlistId_key" ON "PlaylistPurchase"("userId", "playlistId");

-- AddForeignKey
ALTER TABLE "PlaylistPurchase" ADD CONSTRAINT "PlaylistPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistPurchase" ADD CONSTRAINT "PlaylistPurchase_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
