// pages/api/components/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        const components = await prisma.component.findMany({ orderBy: { createdAt: "desc" } });
        return res.status(200).json(components);

      case "POST":
        const newComponent = await prisma.component.create({
          data: req.body,
        });
        return res.status(201).json(newComponent);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}