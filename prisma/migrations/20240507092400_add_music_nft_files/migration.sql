-- CreateTable
CREATE TABLE "public"."music_nft_files" (
    "id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "music_nft_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "music_nft_files_id_key" ON "public"."music_nft_files"("id");

-- CreateIndex
CREATE INDEX "music_nft_files_nft_id_idx" ON "public"."music_nft_files"("nft_id");

-- CreateIndex
CREATE INDEX "music_nft_files_cid_idx" ON "public"."music_nft_files"("cid");

-- AddForeignKey
ALTER TABLE "public"."music_nft_files" ADD CONSTRAINT "music_nft_files_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "public"."music_nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
