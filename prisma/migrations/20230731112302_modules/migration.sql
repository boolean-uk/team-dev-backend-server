/*
  Warnings:

  - A unique constraint covering the columns `[moduleName]` on the table `Module` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Module_moduleName_key" ON "Module"("moduleName");
