-- DropForeignKey
ALTER TABLE "webhook_requests" DROP CONSTRAINT "webhook_requests_webhook_id_fkey";

-- AddForeignKey
ALTER TABLE "webhook_requests" ADD CONSTRAINT "webhook_requests_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
