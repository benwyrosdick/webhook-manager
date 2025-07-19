-- AlterTable
ALTER TABLE "webhooks" ADD COLUMN     "preview_field" TEXT,
ALTER COLUMN "target_url" DROP NOT NULL;
