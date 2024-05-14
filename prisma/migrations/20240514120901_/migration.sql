/*
  Warnings:

  - You are about to drop the column `owner_id` on the `storage_ipfs_owners` table. All the data in the column will be lost.
  - Added the required column `owner` to the `storage_ipfs_owners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."storage_ipfs_owners" DROP CONSTRAINT "storage_ipfs_owners_owner_id_fkey";

-- DropIndex
DROP INDEX "public"."storage_ipfs_owners_ipfs_id_idx";

-- DropIndex
DROP INDEX "public"."storage_ipfs_owners_owner_id_idx";

-- AlterTable
ALTER TABLE "public"."storage_ipfs_owners" DROP COLUMN "owner_id",
ADD COLUMN     "owner" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "storage_ipfs_owners_ipfs_id_owner_idx" ON "public"."storage_ipfs_owners"("ipfs_id", "owner");
