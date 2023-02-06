/*
  Warnings:

  - Added the required column `cohortName` to the `Cohort` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course` to the `Cohort` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Cohort` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Cohort` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cohort" ADD COLUMN     "cohortName" TEXT NOT NULL,
ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "endDate" TEXT NOT NULL,
ADD COLUMN     "startDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
