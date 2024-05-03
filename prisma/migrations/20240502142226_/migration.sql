/*
  Warnings:

  - You are about to drop the column `etag` on the `storage_ipfs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."storage_ipfs" DROP COLUMN "etag";
