// pages/api/assets/index.ts
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const assets = await prisma.asset.findMany();
    res.json(assets);
  } else if (req.method === "POST") {
    try {
      const newAsset = await prisma.asset.create({
        data: req.body,
      });
      res.status(201).json(newAsset);
    } catch (error) {
      console.error("POST error:", error);
      res.status(500).json({ error: "Failed to create asset" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}