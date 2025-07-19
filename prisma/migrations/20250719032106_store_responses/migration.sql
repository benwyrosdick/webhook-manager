/*
  Warnings:

  - You are about to drop the column `webhook_path` on the `webhooks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[path]` on the table `webhooks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `webhooks` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "webhooks_webhook_path_key";

-- AlterTable
ALTER TABLE "webhook_requests" ADD COLUMN     "relay_response" TEXT,
ADD COLUMN     "relay_status" TEXT;

-- AlterTable
ALTER TABLE "webhooks" DROP COLUMN "webhook_path",
ADD COLUMN     "path" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "webhooks_path_key" ON "webhooks"("path");
