// pages/api/vm-inventory/index.ts
import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const body = req.body;

      // Defensive parsing of startDate/endDate
      const startDate = body.startDate ? new Date(body.startDate) : null;
      const endDate = body.endDate ? new Date(body.endDate) : null;

      if (!startDate || isNaN(startDate.getTime()) || !endDate || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid or missing dates" });
      }

      const vm = await prisma.vMInventory.create({
        data: {
          startDate,
          endDate,
          validity: body.validity || "available",
          hypervisor: body.hypervisor || "",
          hostname: body.hostname || "",
          hostModel: body.hostModel || "",
          hostIpAddress: body.hostIpAddress || "",
          hostOS: body.hostOS || "",
          rack: body.rack || "",
          vmId: body.vmId || "",
          vmName: body.vmName || "",
          vmStatus: body.vmStatus || "Running",
          vmIpAddress: body.vmIpAddress || "",
          internetAccess: !!body.internetAccess,
          vmOS: body.vmOS || "",
          vmOSVersion: body.vmOSVersion || "",
          deployedBy: body.deployedBy || "",
          user: body.user || "",
          department: body.department || "",
          jiraTicketNumber: body.jiraTicketNumber || "",
          remarks: body.remarks || "",
        },
      });

      return res.status(201).json(vm);
    }

    if (req.method === "GET") {
      const vms = await prisma.vMInventory.findMany();
      return res.status(200).json(vms);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error: any) {
    console.error("API error (vm-inventory):", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
