/*
  Warnings:

  - You are about to drop the `module` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "module";

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "moduleName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToModule" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToModule_AB_unique" ON "_CourseToModule"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToModule_B_index" ON "_CourseToModule"("B");

-- AddForeignKey
ALTER TABLE "_CourseToModule" ADD CONSTRAINT "_CourseToModule_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToModule" ADD CONSTRAINT "_CourseToModule_B_fkey" FOREIGN KEY ("B") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
