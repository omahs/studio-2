/*
  Warnings:

  - You are about to drop the column `cache_control` on the `storage_ipfs` table. All the data in the column will be lost.
  - You are about to drop the column `content_length` on the `storage_ipfs` table. All the data in the column will be lost.
  - You are about to drop the column `last_accessed_at` on the `storage_ipfs` table. All the data in the column will be lost.
  - You are about to drop the column `last_modified` on the `storage_ipfs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."storage_ipfs" DROP COLUMN "cache_control",
DROP COLUMN "content_length",
DROP COLUMN "last_accessed_at",
DROP COLUMN "last_modified";
