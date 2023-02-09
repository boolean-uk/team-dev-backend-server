-- This is an empty migration.
UPDATE "Cohort"
SET "startDate" = now(), "endDate" = now()
WHERE "startDate" IS NULL AND "endDate" IS NULL

