/*
  Warnings:

  - A unique constraint covering the columns `[sequenceId]` on the table `DeliveryLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sequenceId` to the `DeliveryLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryLog" ADD COLUMN     "sequenceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryLog_sequenceId_key" ON "DeliveryLog"("sequenceId");

-- AddForeignKey
ALTER TABLE "DeliveryLog" ADD CONSTRAINT "DeliveryLog_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "Sequence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
