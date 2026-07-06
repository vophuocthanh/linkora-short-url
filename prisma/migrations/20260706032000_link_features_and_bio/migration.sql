-- AlterTable: User gains link-in-bio fields
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "bio" TEXT;

-- AlterTable: Link gains power-features + bio fields
ALTER TABLE "Link" ADD COLUMN "title" TEXT;
ALTER TABLE "Link" ADD COLUMN "expiresAt" TIMESTAMP(3);
ALTER TABLE "Link" ADD COLUMN "password" TEXT;
ALTER TABLE "Link" ADD COLUMN "maxClicks" INTEGER;
ALTER TABLE "Link" ADD COLUMN "safePreview" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Link" ADD COLUMN "showOnBio" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex: unique handle for /u/{username}
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
