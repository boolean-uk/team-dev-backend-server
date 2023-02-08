/*
  Warnings:

  - A unique constraint covering the columns `[cohortName]` on the table `Cohort` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cohortName` to the `Cohort` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Cohort` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Cohort` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cohort" ADD COLUMN     "cohortName" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_cohortName_key" ON "Cohort"("cohortName");
