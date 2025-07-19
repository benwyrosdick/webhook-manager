/*
  Warnings:

  - You are about to drop the `url_mappings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `webhook_id` to the `webhook_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "webhook_requests" ADD COLUMN     "webhook_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "url_mappings";

-- CreateTable
CREATE TABLE "webhooks" (
    "id" SERIAL NOT NULL,
    "webhook_path" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhooks_webhook_path_key" ON "webhooks"("webhook_path");

-- AddForeignKey
ALTER TABLE "webhook_requests" ADD CONSTRAINT "webhook_requests_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhooks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
