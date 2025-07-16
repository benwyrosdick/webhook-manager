-- CreateTable
CREATE TABLE "webhook_requests" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headers" TEXT,
    "body" TEXT,
    "query_params" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "webhook_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "url_mappings" (
    "id" SERIAL NOT NULL,
    "webhook_path" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "url_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "url_mappings_webhook_path_key" ON "url_mappings"("webhook_path");
