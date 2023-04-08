-- CreateTable
CREATE TABLE "shortened_urls" (
    "id" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shortened_urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" TEXT NOT NULL,
    "url_id" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortened_urls_hash_key" ON "shortened_urls"("hash");

-- CreateIndex
CREATE INDEX "shortened_urls_hash_idx" ON "shortened_urls"("hash");

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "shortened_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
