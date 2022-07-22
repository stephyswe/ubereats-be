/*
  Warnings:

  - You are about to drop the column `categoryName` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `isVegan` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "categoryName",
DROP COLUMN "isVegan";
