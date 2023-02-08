/*
  Warnings:

  - Made the column `cohortName` on table `Cohort` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cohort" ALTER COLUMN "cohortName" SET NOT NULL;
