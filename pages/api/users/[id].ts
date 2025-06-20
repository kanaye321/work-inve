// pages/api/users/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = parseInt(req.query.id as string, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    if (req.method === "PUT") {
      const {
        name,
        email,
        role,
        department,
        position,
        phone,
        location,
        isActive,
        isAdmin,
      } = req.body;

      if (!name || !email || !role) {
        return res.status(400).json({ error: "Missing required fields: name, email, or role" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          role,
          department,
          position,
          phone,
          location,
          isActive,
          isAdmin,
        },
      });

      return res.status(200).json(updatedUser);
    }

    if (req.method === "DELETE") {
      await prisma.user.delete({
        where: { id: userId },
      });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("User API error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
