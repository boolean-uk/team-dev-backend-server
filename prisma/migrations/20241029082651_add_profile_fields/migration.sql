-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "mobile" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "specialism" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "username" TEXT NOT NULL DEFAULT E'';
