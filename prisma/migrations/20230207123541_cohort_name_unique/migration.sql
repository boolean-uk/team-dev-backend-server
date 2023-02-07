/*
  Warnings:

  - A unique constraint covering the columns `[cohortName]` on the table `Cohort` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cohort_cohortName_key" ON "Cohort"("cohortName");
