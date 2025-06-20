// FILE: src/components/vm-inventory/ImportExportVM.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { VMInventory } from "@/types";
import Papa from "papaparse";
import { useRef } from "react";

interface ImportExportVMProps {
  vms: VMInventory[];
  onImport: (importedVMs: VMInventory[]) => void;
}

export default function ImportExportVM({ vms, onImport }: ImportExportVMProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const csv = Papa.unparse(
      vms.map((vm) => ({
        startDate: vm.startDate,
        endDate: vm.endDate,
        validity: vm.validity,
        hypervisor: vm.hypervisor,
        hostname: vm.hostname,
        hostModel: vm.hostModel,
        hostIpAddress: vm.hostIpAddress,
        hostOS: vm.hostOS,
        rack: vm.rack,
        vmId: vm.vmId,
        vmName: vm.vmName,
        vmStatus: vm.vmStatus,
        vmIpAddress: vm.vmIpAddress,
        internetAccess: vm.internetAccess ? "true" : "false",
        vmOS: vm.vmOS,
        vmOSVersion: vm.vmOSVersion,
        deployedBy: vm.deployedBy,
        user: vm.user,
        department: vm.department,
        jiraTicketNumber: vm.jiraTicketNumber,
        remarks: vm.remarks,
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vm_inventory_export.csv";
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data as any[];
        const importedVMs: VMInventory[] = rows.map((row, idx) => ({
          id: `imported-${Date.now()}-${idx}`,
          startDate: row.startDate || "",
          endDate: row.endDate || "",
          validity: row.validity || "available",
          hypervisor: row.hypervisor || "",
          hostname: row.hostname || "",
          hostModel: row.hostModel || "",
          hostIpAddress: row.hostIpAddress || "",
          hostOS: row.hostOS || "",
          rack: row.rack || "",
          vmId: row.vmId || "",
          vmName: row.vmName || "",
          vmStatus: row.vmStatus || "Running",
          vmIpAddress: row.vmIpAddress || "",
          internetAccess: row.internetAccess === "true",
          vmOS: row.vmOS || "",
          vmOSVersion: row.vmOSVersion || "",
          deployedBy: row.deployedBy || "",
          user: row.user || "",
          department: row.department || "",
          jiraTicketNumber: row.jiraTicketNumber || "",
          remarks: row.remarks || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        onImport(importedVMs);
        event.target.value = ""; // Reset input
      },
      error: (error) => {
        console.error("CSV Import Error:", error);
      },
    });
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={handleImportClick}>
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
        <Button type="button" variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </>
  );
}
