/*
  Warnings:

  - You are about to drop the `_CourseToModule` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_CourseToModule" DROP CONSTRAINT "_CourseToModule_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToModule" DROP CONSTRAINT "_CourseToModule_B_fkey";

-- DropTable
DROP TABLE "_CourseToModule";

-- CreateTable
CREATE TABLE "CourseToModule" (
    "courseId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "CourseToModule_pkey" PRIMARY KEY ("courseId","moduleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- AddForeignKey
ALTER TABLE "CourseToModule" ADD CONSTRAINT "CourseToModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseToModule" ADD CONSTRAINT "CourseToModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
