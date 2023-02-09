/*
  Warnings:

  - You are about to drop the column `endDate` on the `Cohort` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Cohort` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cohort" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ALTER COLUMN "cohortName" DROP NOT NULL;
