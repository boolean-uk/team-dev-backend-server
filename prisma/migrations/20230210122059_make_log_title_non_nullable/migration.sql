/*
  Warnings:

  - Made the column `title` on table `DeliveryLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DeliveryLog" ALTER COLUMN "title" SET NOT NULL;
