/*
  Warnings:

  - The primary key for the `storage_ipfs_owners` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `storage_ipfs_owners` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."storage_ipfs_owners_id_key";

-- DropIndex
DROP INDEX "public"."storage_ipfs_owners_ipfs_id_owner_idx";

-- AlterTable
ALTER TABLE "public"."storage_ipfs_owners" DROP CONSTRAINT "storage_ipfs_owners_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "storage_ipfs_owners_pkey" PRIMARY KEY ("ipfs_id", "owner");
