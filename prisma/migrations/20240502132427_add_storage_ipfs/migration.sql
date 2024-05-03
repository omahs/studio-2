-- CreateTable
CREATE TABLE "public"."storage_ipfs" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT,
    "etag" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "cache_control" TEXT NOT NULL,
    "content_length" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_accessed_at" TIMESTAMP(3),
    "last_modified" TIMESTAMP(3),

    CONSTRAINT "storage_ipfs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "storage_ipfs_id_key" ON "public"."storage_ipfs"("id");

-- CreateIndex
CREATE INDEX "storage_ipfs_owner_idx" ON "public"."storage_ipfs"("owner");
