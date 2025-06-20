/*
  Warnings:

  - You are about to drop the `VM` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "VMInventory" ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET DATA TYPE DATE;

-- DropTable
DROP TABLE "VM";
