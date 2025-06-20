-- CreateTable
CREATE TABLE "Accessory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "model" TEXT,
    "manufacturer" TEXT,
    "status" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quantityAvailable" INTEGER NOT NULL,
    "purchaseDate" TEXT,
    "purchaseCost" DOUBLE PRECISION,
    "assignedTo" TEXT,
    "releasedBy" TEXT,
    "dateReleased" TEXT,
    "returnedTo" TEXT,
    "dateReturned" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);
