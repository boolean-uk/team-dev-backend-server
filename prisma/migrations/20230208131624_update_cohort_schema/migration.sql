-- AlterTable
ALTER TABLE "Cohort" ALTER COLUMN "cohortName" DROP NOT NULL,
ALTER COLUMN "cohortName" SET DEFAULT E'';
