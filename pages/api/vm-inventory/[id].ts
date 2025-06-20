// --- FILE: pages/api/vm-inventory/[id].ts ---

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  if (!id) return res.status(400).json({ message: "Missing ID" });

  try {
    if (req.method === "PUT") {
      const data = req.body;

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      const updatedVM = await prisma.vMInventory.update({
        where: { id },
        data: {
          startDate,
          endDate,
          validity: data.validity,
          hypervisor: data.hypervisor,
          hostname: data.hostname,
          hostModel: data.hostModel,
          hostIpAddress: data.hostIpAddress,
          hostOS: data.hostOS,
          rack: data.rack,
          vmId: data.vmId,
          vmName: data.vmName,
          vmStatus: data.vmStatus,
          vmIpAddress: data.vmIpAddress,
          internetAccess: data.internetAccess,
          vmOS: data.vmOS,
          vmOSVersion: data.vmOSVersion,
          deployedBy: data.deployedBy,
          user: data.user,
          department: data.department,
          jiraTicketNumber: data.jiraTicketNumber,
          remarks: data.remarks,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(updatedVM);
    }

    if (req.method === "DELETE") {
      const deleted = await prisma.vMInventory.delete({
        where: { id },
      });

      return res.status(200).json({ message: "VM deleted", deleted });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("API error (vm-inventory [id]):", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
