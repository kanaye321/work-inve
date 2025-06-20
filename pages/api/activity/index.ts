// FILE: pages/api/activity/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
