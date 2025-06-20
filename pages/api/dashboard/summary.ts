// pages/api/dashboard/summary.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [totalAssets, totalUsers, totalComponents, totalAccessories, totalLicenses, totalZabbixVMs, expiringLicenses, deployedAssets, availableAssets, maintenanceAssets, decommissionedAssets] = await Promise.all([
      prisma.asset.count(),
      prisma.user.count(),
      prisma.component.count(),
      prisma.accessory.count(),
      prisma.license.count(),
      prisma.zabbixVM.count(),
      prisma.license.count({
        where: {
          expirationDate: {
            gt: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.asset.count({ where: { status: "deployed" } }),
      prisma.asset.count({ where: { status: "available" } }),
      prisma.asset.count({ where: { status: "maintenance" } }),
      prisma.asset.count({ where: { status: "decommissioned" } }),
    ]);

    res.status(200).json({
      totalAssets,
      totalUsers,
      totalComponents,
      totalAccessories,
      totalLicenses,
      totalZabbixVMs,
      expiringLicenses,
      deployedAssets,
      availableAssets,
      maintenanceAssets,
      decommissionedAssets,
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
