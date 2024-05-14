/*
  Warnings:

  - You are about to drop the column `owner` on the `storage_ipfs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."storage_ipfs_owner_idx";

-- AlterTable
ALTER TABLE "public"."storage_ipfs" DROP COLUMN "owner",
ALTER COLUMN "size" SET DEFAULT 0,
ALTER COLUMN "mimetype" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."storage_ipfs_owners" (
    "id" TEXT NOT NULL,
    "ipfs_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "storage_ipfs_owners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "storage_ipfs_owners_id_key" ON "public"."storage_ipfs_owners"("id");

-- CreateIndex
CREATE INDEX "storage_ipfs_owners_ipfs_id_idx" ON "public"."storage_ipfs_owners"("ipfs_id");

-- CreateIndex
CREATE INDEX "storage_ipfs_owners_owner_id_idx" ON "public"."storage_ipfs_owners"("owner_id");

-- AddForeignKey
ALTER TABLE "public"."storage_ipfs_owners" ADD CONSTRAINT "storage_ipfs_owners_ipfs_id_fkey" FOREIGN KEY ("ipfs_id") REFERENCES "public"."storage_ipfs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."storage_ipfs_owners" ADD CONSTRAINT "storage_ipfs_owners_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "web3auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
