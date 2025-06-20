// --- FILE: pages/assets/index.tsx ---

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset } from "@/types";
import AssetFormModal from "@/components/assets/AssetFormModal";
import DeleteConfirmationDialog from "@/components/assets/DeleteConfirmationDialog";
import ImportExportButtons from "@/components/assets/ImportExportButtons";
import { useToast } from "@/hooks/use-toast";

export default function AssetsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/assets");
      const data = await res.json();
      setAssets(data);
      setFilteredAssets(data);
    } catch {
      toast({ title: "Failed to load assets", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    handleSearch({ target: { value: searchQuery } } as React.ChangeEvent<HTMLInputElement>);
  }, [statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAssets(
      assets.filter(
        (asset) =>
          (asset.assetTag?.toLowerCase().includes(query) ||
            asset.serialNumber?.toLowerCase().includes(query) ||
            asset.model?.toLowerCase().includes(query) ||
            asset.category?.toLowerCase().includes(query) ||
            asset.assignedTo?.toLowerCase().includes(query)) &&
          (!statusFilter || asset.status === statusFilter)
      )
    );
  };

  const handleAddAsset = () => {
    setCurrentAsset(null);
    setIsAddModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsEditModalOpen(true);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsDeleteDialogOpen(true);
  };

  const saveAsset = async (assetData: Partial<Asset>) => {
    try {
      const payload = {
        assetTag: assetData.assetTag || "",
        model: assetData.model || "",
        serialNumber: assetData.serialNumber || "",
        macAddress: assetData.macAddress || "",
        ipAddress: assetData.ipAddress || "",
        status: assetData.status || "available",
        financeChecked: !!assetData.financeChecked,
        assignedTo: assetData.assignedTo || "",
        dateReleased: assetData.dateReleased || "",
        releasedBy: assetData.releasedBy || "",
        category: assetData.category || "",
        manufacturer: assetData.manufacturer || "",
        location: assetData.location || "",
        notes: assetData.notes || "",
      };

      if (currentAsset) {
        await fetch(`/api/assets/${currentAsset.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast({ title: "Asset Updated" });
        setIsEditModalOpen(false);
      } else {
        await fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast({ title: "Asset Added" });
        setIsAddModalOpen(false);
      }
      fetchAssets();
    } catch (error) {
      console.error("Save failed:", error);
      toast({ title: "Save failed", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    try {
      if (currentAsset) {
        await fetch(`/api/assets/${currentAsset.id}`, { method: "DELETE" });
        toast({ title: "Asset Deleted", variant: "destructive" });
        fetchAssets();
        setIsDeleteDialogOpen(false);
      }
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleImportAssets = async (importedAssets: Asset[]) => {
    try {
      for (const asset of importedAssets) {
        const payload = {
          assetTag: asset.assetTag || "",
          model: asset.model || "",
          serialNumber: asset.serialNumber || "",
          macAddress: asset.macAddress || "",
          ipAddress: asset.ipAddress || "",
          status: asset.status || "available",
          financeChecked: !!asset.financeChecked,
          assignedTo: asset.assignedTo || "",
          dateReleased: asset.dateReleased || "",
          releasedBy: asset.releasedBy || "",
          category: asset.category || "",
          manufacturer: asset.manufacturer || "",
          location: asset.location || "",
          notes: asset.notes || "",
        };

        const res = await fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.error("Failed to import asset:", payload);
        }
      }
      toast({
        title: "Assets Imported",
        description: `${importedAssets.length} assets successfully saved to the database.`,
      });
      fetchAssets();
    } catch (error) {
      console.error("Import Error:", error);
      toast({ title: "Import failed", variant: "destructive" });
    }
  };

  const getStatusBadgeClass = (status: string | undefined) => {
    switch (status) {
      case "deployed": return "bg-blue-100 text-blue-800";
      case "available": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "decommissioned": return "bg-gray-100 text-gray-800";
      case "assigned": return "bg-indigo-100 text-indigo-800";
      case "returned": return "bg-purple-100 text-purple-800";
      case "resigned": return "bg-orange-100 text-orange-800";
      case "replacement": return "bg-teal-100 text-teal-800";
      case "defective": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout title="Assets | IT Asset Manager">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <Button onClick={handleAddAsset}><Plus className="h-4 w-4 mr-2" />Add Asset</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Asset Inventory</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Search assets..." className="pl-8" value={searchQuery} onChange={handleSearch} />
              </div>
              <div className="flex gap-2 items-start">
                <div className="relative">
                  <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <Filter className="h-4 w-4" />
                  </Button>
                  {isFilterOpen && (
                    <div className="absolute z-10 mt-2 w-48 rounded-md border bg-white shadow-md p-2">
                      <p className="text-sm font-medium mb-1">Filter by Status:</p>
                      {["available", "deployed", "maintenance", "decommissioned", "assigned", "returned"].map((status) => (
                        <button
                          key={status}
                          className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-sm ${statusFilter === status ? "bg-gray-200 font-semibold" : ""}`}
                          onClick={() => {
                            setStatusFilter(status);
                            setIsFilterOpen(false);
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                      <button
                        className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-sm text-red-500 mt-2"
                        onClick={() => {
                          setStatusFilter(null);
                          setIsFilterOpen(false);
                        }}
                      >
                        Clear Filter
                      </button>
                    </div>
                  )}
                </div>
                <ImportExportButtons assets={assets} onImport={handleImportAssets} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Asset Tag</th>
                    <th className="px-4 py-3">Model</th>
                    <th className="px-4 py-3">Serial Number</th>
                    <th className="px-4 py-3">MAC Address</th>
                    <th className="px-4 py-3">IP Address</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Finance Check</th>
                    <th className="px-4 py-3">Assigned To</th>
                    <th className="px-4 py-3">Date Released</th>
                    <th className="px-4 py-3">Released By</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map(asset => (
                    <tr key={asset.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{asset.assetTag || 'N/A'}</td>
                      <td className="px-4 py-3">{asset.model || 'N/A'}</td>
                      <td className="px-4 py-3">{asset.serialNumber || 'N/A'}</td>
                      <td className="px-4 py-3">{asset.macAddress || 'N/A'}</td>
                      <td className="px-4 py-3">{asset.ipAddress || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(asset.status)}`}>
                          {asset.status ? asset.status.charAt(0).toUpperCase() + asset.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {asset.financeChecked ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                      </td>
                      <td className="px-4 py-3">{asset.assignedTo || 'Unassigned'}</td>
                      <td className="px-4 py-3">{asset.dateReleased || 'N/A'}</td>
                      <td className="px-4 py-3">{asset.releasedBy || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditAsset(asset)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset)}><Trash className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AssetFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={saveAsset} />
      {currentAsset && <AssetFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={saveAsset} asset={currentAsset} />}
      {currentAsset && <DeleteConfirmationDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={confirmDelete} itemName={`asset ${currentAsset.assetTag}`} />}
    </Layout>
  );
}
