// pages/api/accessories/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const accessories = await prisma.accessory.findMany();
      return res.status(200).json(accessories);
    }

    if (req.method === "POST") {
      const accessory = await prisma.accessory.create({
        data: req.body,
      });
      return res.status(201).json(accessory);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API error (accessories):", err); // 👈 add this
    return res.status(500).json({ error: "Server error" });
  }
}