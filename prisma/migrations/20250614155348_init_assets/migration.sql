-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "assetTag" TEXT NOT NULL,
    "serialNumber" TEXT,
    "model" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT,
    "location" TEXT,
    "purchaseDate" TEXT NOT NULL,
    "purchaseCost" DOUBLE PRECISION NOT NULL,
    "warrantyExpires" TEXT,
    "notes" TEXT,
    "macAddress" TEXT,
    "ipAddress" TEXT,
    "financeChecked" BOOLEAN NOT NULL DEFAULT false,
    "assignedTo" TEXT,
    "dateReleased" TEXT,
    "releasedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetTag_key" ON "Asset"("assetTag");
