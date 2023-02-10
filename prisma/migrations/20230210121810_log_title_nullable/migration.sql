/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `DeliveryLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DeliveryLog" ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryLog_title_key" ON "DeliveryLog"("title");
