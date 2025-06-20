/*
  Warnings:

  - You are about to drop the column `purchaseCost` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyExpires` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `status` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Made the column `serialNumber` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `manufacturer` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notes` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `macAddress` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ipAddress` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assignedTo` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateReleased` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `releasedBy` on table `Asset` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Asset_assetTag_key";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "purchaseCost",
DROP COLUMN "purchaseDate",
DROP COLUMN "updatedAt",
DROP COLUMN "warrantyExpires",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "serialNumber" SET NOT NULL,
ALTER COLUMN "manufacturer" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "notes" SET NOT NULL,
ALTER COLUMN "macAddress" SET NOT NULL,
ALTER COLUMN "ipAddress" SET NOT NULL,
ALTER COLUMN "financeChecked" DROP DEFAULT,
ALTER COLUMN "assignedTo" SET NOT NULL,
ALTER COLUMN "dateReleased" SET NOT NULL,
ALTER COLUMN "releasedBy" SET NOT NULL;
