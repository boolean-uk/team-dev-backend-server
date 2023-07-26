/*
  Warnings:

  - Added the required column `title` to the `DeliveryLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryLog" ADD COLUMN     "title" TEXT NOT NULL;
