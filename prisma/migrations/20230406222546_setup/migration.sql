-- CreateTable
CREATE TABLE "shortened_urls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "href" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Statistic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url_id" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Statistic_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "shortened_urls" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "shortened_urls_hash_key" ON "shortened_urls"("hash");

-- CreateIndex
CREATE INDEX "shortened_urls_hash_idx" ON "shortened_urls"("hash");
