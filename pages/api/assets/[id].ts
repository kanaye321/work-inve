// pages/api/assets/[id].ts
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const updated = await prisma.asset.update({
        where: { id: Number(id) },
        data: req.body,
      });
      res.json(updated);
    } catch (error) {
      console.error("PUT error:", error);
      res.status(500).json({ error: "Failed to update asset" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.asset.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      console.error("DELETE error:", error);
      res.status(500).json({ error: "Failed to delete asset" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}