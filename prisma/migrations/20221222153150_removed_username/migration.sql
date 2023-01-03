/*
  Warnings:

  - You are about to drop the column `username` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `SocialLink` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mobile` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SocialLink" DROP CONSTRAINT "SocialLink_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "username",
ADD COLUMN     "mobile" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SocialLink";
