-- This is an empty migration.
UPDATE "Cohort"
SET "cohortName" = id::text
WHERE "cohortName" = NULL