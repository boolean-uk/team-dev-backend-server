/*
  Warnings:

  - You are about to drop the column `courseName` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `moduleName` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `unitName` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the `Excersie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Excersie" DROP CONSTRAINT "Excersie_unitId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "courseName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "moduleName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "unitName",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Excersie";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
