// --- FILE: pages/api/users/index.ts ---

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    }

    if (req.method === "POST") {
      const data = req.body;

      // Basic validation
      if (!data.name || !data.email) {
        return res.status(400).json({ error: "Name and email are required." });
      }

      const newUser = await prisma.user.create({ data });
      return res.status(201).json(newUser);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error (users):", error);
    return res.status(500).json({ error: "Server error" });
  }
}
