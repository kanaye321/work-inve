// pages/api/components/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "PUT":
        const updated = await prisma.component.update({
          where: { id },
          data: req.body,
        });
        return res.status(200).json(updated);

      case "DELETE":
        await prisma.component.delete({
          where: { id },
        });
        return res.status(204).end();

      default:
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}