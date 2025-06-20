import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Asset } from "@/types";

interface ImportExportButtonsProps {
  assets: Asset[];
  onImport: (assets: Asset[]) => void;
}

export default function ImportExportButtons({ assets, onImport }: ImportExportButtonsProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    // Create CSV content
    const headers = [
      "Asset Tag",
      "Model",
      "Serial Number",
      "Manufacturer",
      "Category",
      "Purchase Date",
      "Purchase Cost",
      "Warranty Expires",
      "Location",
      "MAC Address",
      "IP Address",
      "Status",
      "Finance Check",
      "Assigned To",
      "Date Released",
      "Released By"
    ];

    const csvRows = [
      headers.join(","),
      ...assets.map(asset => [
        asset.assetTag,
        asset.model,
        asset.serialNumber || "",
        asset.manufacturer || "",
        asset.category,
        asset.purchaseDate || "",
        asset.purchaseCost?.toString() || "",
        asset.warrantyExpires || "",
        asset.location || "",
        asset.macAddress || "",
        asset.ipAddress || "",
        asset.status,
        asset.financeChecked ? "Yes" : "No",
        asset.assignedTo?.toString() || "",
        asset.dateReleased || "",
        asset.releasedBy || ""
      ].join(",")),
    ];

    const csvContent = csvRows.join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `assets_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    setImportFile(null);
    setImportError(null);
    setIsImportDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
      setImportError(null);
    }
  };

  const processImport = () => {
    if (!importFile) {
      setImportError("Please select a file to import");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split("\n");
        
        // Skip header row
        if (lines.length < 2) {
          setImportError("File is empty or invalid");
          return;
        }

        const headers = lines[0].split(",");
        const importedAssets: Asset[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(",");
          if (values.length < headers.length) continue; // Skip invalid rows
          
          const newAsset: Partial<Asset> = {
            // id: `asset-import-${i}-${Date.now()}`, // Remove ID - DB will assign it
            assetTag: values[0] || `AST-${Math.floor(Math.random() * 10000)}`,
            // name: values[1] || "Imported Asset", // Remove name - not in Asset type
            model: values[1] || "",
            serialNumber: values[2] || "",
            manufacturer: values[3] || "",
            category: values[4] || "",
            purchaseDate: values[5] || "",
            purchaseCost: parseFloat(values[6]) || 0,
            warrantyExpires: values[7] || "",
            location: values[8] || "",
            macAddress: values[9] || "",
            ipAddress: values[10] || "",
            status: (values[11] as any) || "available", // Cast status carefully
            financeChecked: values[12]?.toLowerCase() === "yes",
            assignedTo: values[13] || "",
            dateReleased: values[14] || "",
            releasedBy: values[15] || "",
            // lastUpdated: new Date().toISOString(), // Remove lastUpdated - not in Asset type
            createdAt: new Date().toISOString() // Keep createdAt if needed, or remove if DB handles it
          };
          
          // Ensure the object conforms to Partial<Asset> before pushing
          importedAssets.push(newAsset as Asset); // Cast carefully, assuming onImport handles missing ID
        }
        
        if (importedAssets.length === 0) {
          setImportError("No valid assets found in the file");
          return;
        }
        
        onImport(importedAssets);
        setIsImportDialogOpen(false);
        
      } catch (error) {
        setImportError("Error processing file. Please check the format.");
        console.error("Import error:", error);
      }
    };
    
    fileReader.onerror = () => {
      setImportError("Error reading file");
    };
    
    fileReader.readAsText(importFile);
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      "Asset Tag",
      "Model",
      "Serial Number",
      "Manufacturer",
      "Category",
      "Purchase Date",
      "Purchase Cost",
      "Warranty Expires",
      "Location",
      "MAC Address",
      "IP Address",
      "Status",
      "Finance Check (Yes/No)",
      "Assigned To",
      "Date Released",
      "Released By"
    ];
    
    const exampleRow = [
      "AST-1234",
      "Dell XPS 15",
      "DELL123456",
      "Dell",
      "Laptop",
      "2023-01-01",
      "1500",
      "2024-01-01",
      "Main Office",
      "00:1A:2B:3C:4D:5E",
      "192.168.1.100",
      "available",
      "Yes",
      "John Smith",
      "2023-05-01",
      "IT Admin"
    ];
    
    const csvContent = [templateHeaders.join(","), exampleRow.join(",")].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "assets_import_template.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleExport}
          title="Export Assets"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleImportClick}
          title="Import Assets"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Assets</DialogTitle>
            <DialogDescription>
              Upload a CSV file with asset data. Make sure it follows the correct format.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="importFile">CSV File</Label>
              <Input
                id="importFile"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              {importError && (
                <p className="text-sm text-red-500 mt-1">{importError}</p>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              <p>The CSV file should have the following columns:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Asset Tag</li>
                <li>Model</li>
                <li>Serial Number</li>
                <li>Manufacturer</li>
                <li>Category</li>
                <li>Purchase Date</li>
                <li>Purchase Cost</li>
                <li>Warranty Expires</li>
                <li>Location</li>
                <li>MAC Address</li>
                <li>IP Address</li>
                <li>Status</li>
                <li>Finance Check (Yes/No)</li>
                <li>Assigned To</li>
                <li>Date Released</li>
                <li>Released By</li>
              </ul>
              <Button 
                variant="link" 
                className="p-0 h-auto mt-2 text-blue-600"
                onClick={downloadTemplate}
              >
                Download template
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processImport}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}