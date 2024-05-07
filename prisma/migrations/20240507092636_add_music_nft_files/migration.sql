/*
  Warnings:

  - Added the required column `file_type` to the `music_nft_files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."music_nft_file_type" AS ENUM ('Audio', 'Video', 'Artwork');

-- AlterTable
ALTER TABLE "public"."music_nft_files" ADD COLUMN     "file_type" "public"."music_nft_file_type" NOT NULL;
