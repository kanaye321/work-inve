-- CreateTable
CREATE TABLE "VMInventory" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "validity" TEXT NOT NULL,
    "hypervisor" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "hostModel" TEXT NOT NULL,
    "hostIpAddress" TEXT NOT NULL,
    "hostOS" TEXT NOT NULL,
    "rack" TEXT NOT NULL,
    "vmId" TEXT NOT NULL,
    "vmName" TEXT NOT NULL,
    "vmStatus" TEXT NOT NULL,
    "vmIpAddress" TEXT NOT NULL,
    "internetAccess" BOOLEAN NOT NULL,
    "vmOS" TEXT NOT NULL,
    "vmOSVersion" TEXT NOT NULL,
    "deployedBy" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "jiraTicketNumber" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VMInventory_pkey" PRIMARY KEY ("id")
);
