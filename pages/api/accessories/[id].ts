// pages/api/accessories/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid accessory ID" });
  }

  try {
    if (req.method === "PUT") {
      const updated = await prisma.accessory.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.accessory.delete({
        where: { id },
      });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Accessory API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}