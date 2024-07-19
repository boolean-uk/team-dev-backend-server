-- AlterTable
ALTER TABLE "Profile" RENAME COLUMN "githubUrl" TO "githubUsername";

ALTER TABLE "Profile" ADD COLUMN "mobile" TEXT;
ALTER TABLE "Profile" ADD COLUMN "username" TEXT;

ALTER TABLE "Profile" ALTER COLUMN "firstName" DROP NOT NULL;
ALTER TABLE "Profile" ALTER COLUMN "lastName" DROP NOT NULL;
