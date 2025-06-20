// --- FILE: pages/accessories/index.tsx ---

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Edit, Trash } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accessory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationDialog from "@/components/assets/DeleteConfirmationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AccessoriesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [filteredAccessories, setFilteredAccessories] = useState<Accessory[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState<Accessory | null>(null);
  const [formData, setFormData] = useState<Partial<Accessory>>({
    name: '',
    category: '',
    model: '',
    manufacturer: '',
    status: 'borrowed',
    quantity: 1,
    quantityAvailable: 1,
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: 0,
    assignedTo: '',
    releasedBy: '',
    dateReleased: '',
    returnedTo: '',
    dateReturned: '',
    notes: ''
  });

  useEffect(() => {
    async function fetchAccessories() {
      try {
        const res = await fetch("/api/accessories");
        const data = await res.json();
        setAccessories(data);
        setFilteredAccessories(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast({ title: "Error", description: "Failed to load accessories", variant: "destructive" });
      }
    }
    fetchAccessories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAccessories(
      query.trim() === "" ? accessories :
      accessories.filter(a =>
        a.name.toLowerCase().includes(query) ||
        (a.model?.toLowerCase().includes(query)) ||
        a.category.toLowerCase().includes(query) ||
        (a.manufacturer?.toLowerCase().includes(query))
      )
    );
  };

  const handleAddAccessory = () => {
    setCurrentAccessory(null);
    setFormData({
      name: '', category: '', model: '', manufacturer: '', status: 'borrowed',
      quantity: 1, quantityAvailable: 1,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: 0, assignedTo: '', releasedBy: '', dateReleased: '',
      returnedTo: '', dateReturned: '', notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEditAccessory = (accessory: Accessory) => {
    setCurrentAccessory(accessory);
    setFormData(accessory);
    setIsEditModalOpen(true);
  };

  const handleDeleteAccessory = (accessory: Accessory) => {
    setCurrentAccessory(accessory);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentAccessory) return;
    try {
      await fetch(`/api/accessories/${currentAccessory.id}`, { method: "DELETE" });
      const updated = accessories.filter(a => a.id !== currentAccessory.id);
      setAccessories(updated);
      setFilteredAccessories(updated);
      toast({ title: "Deleted", description: `${currentAccessory.name} deleted.`, variant: "destructive" });
    } catch {
      toast({ title: "Error", description: "Failed to delete accessory.", variant: "destructive" });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSelectChange = (name: keyof Accessory, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAccessory = async () => {
    const method = currentAccessory ? "PUT" : "POST";
    const url = currentAccessory ? `/api/accessories/${currentAccessory.id}` : "/api/accessories";
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Request failed");
      const saved = await res.json();

      const updated = currentAccessory
        ? accessories.map(a => a.id === saved.id ? saved : a)
        : [...accessories, saved];

      setAccessories(updated);
      setFilteredAccessories(updated);
      toast({ title: currentAccessory ? "Updated" : "Added", description: `${saved.name} saved.` });
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch {
      toast({ title: "Error", description: "Could not save accessory.", variant: "destructive" });
    }
  };

  const handleExport = () => {
    if (accessories.length === 0) {
      toast({ title: "Nothing to export", description: "No accessory data found.", variant: "destructive" });
      return;
    }

    const headers = [
      "ID", "Name", "Category", "Model", "Manufacturer", "Status", "Quantity", "Available",
      "Purchase Date", "Purchase Cost", "Assigned To", "Released By", "Date Released",
      "Returned To", "Date Returned", "Notes"
    ];

    const csvRows = [
      headers.join(","),
      ...accessories.map(a => [
        a.id,
        a.name,
        a.category,
        a.model || "",
        a.manufacturer || "",
        a.status,
        a.quantity.toString(),
        a.quantityAvailable.toString(),
        a.purchaseDate,
        a.purchaseCost.toString(),
        a.assignedTo || "",
        a.releasedBy || "",
        a.dateReleased || "",
        a.returnedTo || "",
        a.dateReturned || "",
        a.notes || ""
      ].map(val => `"${val}"`).join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `accessories_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "returned": return "bg-purple-100 text-purple-800";
      case "borrowed": return "bg-indigo-100 text-indigo-800";
      case "permanent": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout title="Accessories | IT Asset Manager">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Accessories</h1>
          <Button onClick={handleAddAccessory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Accessory
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accessory Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search accessories..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleExport} title="Export Accessories">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Model</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Available</th>
                    <th className="px-4 py-3">Assigned To</th>
                    <th className="px-4 py-3">Released By</th>
                    <th className="px-4 py-3">Date Released</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccessories.length > 0 ? (
                    filteredAccessories.map((accessory) => (
                      <tr key={accessory.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{accessory.name}</td>
                        <td className="px-4 py-3 capitalize">{accessory.category}</td>
                        <td className="px-4 py-3">{accessory.model}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(accessory.status)}`}>
                            {accessory.status.charAt(0).toUpperCase() + accessory.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">{accessory.quantity}</td>
                        <td className="px-4 py-3">{accessory.quantityAvailable}</td>
                        <td className="px-4 py-3">{accessory.assignedTo || "Unassigned"}</td>
                        <td className="px-4 py-3">{accessory.releasedBy || "N/A"}</td>
                        <td className="px-4 py-3">{accessory.dateReleased || "N/A"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditAccessory(accessory)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAccessory(accessory)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
                        No accessories found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentAccessory && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          itemName={`accessory ${currentAccessory.name}`}
        />
      )}



<Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
  <DialogHeader>
      <DialogTitle>Add Accessory</DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
      <div className="space-y-2 col-span-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" value={formData.category} onChange={handleChange} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="model">Model</Label>
        <Input id="model" name="model" value={formData.model} onChange={handleChange} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="manufacturer">Manufacturer</Label>
        <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="borrowed">Borrowed</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantityAvailable">Available</Label>
        <Input type="number" id="quantityAvailable" name="quantityAvailable" value={formData.quantityAvailable} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="purchaseDate">Purchase Date</Label>
        <Input type="date" id="purchaseDate" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="purchaseCost">Purchase Cost</Label>
        <Input type="number" id="purchaseCost" name="purchaseCost" value={formData.purchaseCost} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="releasedBy">Released By</Label>
        <Input id="releasedBy" name="releasedBy" value={formData.releasedBy} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateReleased">Date Released</Label>
        <Input type="date" id="dateReleased" name="dateReleased" value={formData.dateReleased} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="returnedTo">Returned To</Label>
        <Input id="returnedTo" name="returnedTo" value={formData.returnedTo} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateReturned">Date Returned</Label>
        <Input type="date" id="dateReturned" name="dateReturned" value={formData.dateReturned} onChange={handleChange} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} />
      </div>
    </div>
    <DialogFooter>
    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
    <Button type="button" onClick={handleSaveAccessory}>Save Accessory</Button>
  </DialogFooter>
</DialogContent>
</Dialog>



<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Edit Accessory</DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
      {[
        { name: "name", label: "Name" },
        { name: "category", label: "Category" },
        { name: "model", label: "Model" },
        { name: "manufacturer", label: "Manufacturer" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "quantityAvailable", label: "Available", type: "number" },
        { name: "purchaseDate", label: "Purchase Date", type: "date" },
        { name: "purchaseCost", label: "Purchase Cost", type: "number" },
        { name: "assignedTo", label: "Assigned To" },
        { name: "releasedBy", label: "Released By" },
        { name: "dateReleased", label: "Date Released", type: "date" },
        { name: "returnedTo", label: "Returned To" },
        { name: "dateReturned", label: "Date Returned", type: "date" },
        { name: "notes", label: "Notes" }
      ].map(({ name, label, type }) => (
        <div className="space-y-2 col-span-2" key={name}>
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={`edit-${name}`}
            name={name}
            type={type || "text"}
            value={formData[name as keyof typeof formData] as string || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="space-y-2 col-span-2">
        <Label htmlFor="edit-status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="borrowed">Borrowed</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
      <Button type="button" onClick={handleSaveAccessory}>Update Accessory</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


    </Layout>


  );
}