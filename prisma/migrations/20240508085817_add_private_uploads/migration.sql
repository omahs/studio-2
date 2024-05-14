-- CreateTable
CREATE TABLE "public"."private_uploads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,
    "duration" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "private_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "private_uploads_id_key" ON "public"."private_uploads"("id");

-- CreateIndex
CREATE INDEX "private_uploads_user_id_idx" ON "public"."private_uploads"("user_id");

-- CreateIndex
CREATE INDEX "private_uploads_address_idx" ON "public"."private_uploads"("address");

-- AddForeignKey
ALTER TABLE "public"."private_uploads" ADD CONSTRAINT "private_uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "web3auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
