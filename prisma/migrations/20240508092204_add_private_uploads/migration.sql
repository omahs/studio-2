/*
  Warnings:

  - You are about to drop the column `address` on the `private_uploads` table. All the data in the column will be lost.
  - Added the required column `status` to the `private_uploads` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."private_uploads_status" AS ENUM ('Pending', 'Ready', 'Failed');

-- DropIndex
DROP INDEX "public"."private_uploads_address_idx";

-- AlterTable
ALTER TABLE "public"."private_uploads" DROP COLUMN "address",
ADD COLUMN     "artwork_cid" TEXT,
ADD COLUMN     "audio_cid" TEXT,
ADD COLUMN     "status" "public"."private_uploads_status" NOT NULL;
