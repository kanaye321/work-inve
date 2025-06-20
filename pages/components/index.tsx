// --- FILE: pages/components/index.tsx ---

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Edit, Trash } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Component } from "@/types";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationDialog from "@/components/assets/DeleteConfirmationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ComponentsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [formData, setFormData] = useState<Partial<Component>>({
    name: '', type: '', serialNumber: '', model: '', manufacturer: '', capacitySpecs: '',
    category: 'cpu', status: 'available', assignedTo: '', releasedBy: '', dateReleased: '',
    returnedTo: '', dateReturned: ''
  });

  useEffect(() => {
    async function fetchComponents() {
      try {
        const res = await fetch("/api/components");
        const data = await res.json();
        setComponents(data);
        setFilteredComponents(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast({ title: "Error", description: "Failed to load components", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchComponents();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredComponents(
      query.trim() === "" ? components :
      components.filter(c => c.name.toLowerCase().includes(query) ||
                              c.serialNumber.toLowerCase().includes(query) ||
                              c.model.toLowerCase().includes(query) ||
                              c.category.toLowerCase().includes(query))
    );
  };

  const handleAddComponent = () => {
    setCurrentComponent(null);
    setFormData({ name: '', type: '', serialNumber: '', model: '', manufacturer: '', capacitySpecs: '', category: 'cpu', status: 'available' });
    setIsAddModalOpen(true);
  };

  const handleEditComponent = (component: Component) => {
    setCurrentComponent(component);
    setFormData(component);
    setIsEditModalOpen(true);
  };

  const handleDeleteComponent = (component: Component) => {
    setCurrentComponent(component);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentComponent) return;
    try {
      await fetch(`/api/components/${currentComponent.id}`, { method: "DELETE" });
      const updated = components.filter(c => c.id !== currentComponent.id);
      setComponents(updated);
      setFilteredComponents(updated);
      toast({ title: "Deleted", description: `${currentComponent.name} deleted.`, variant: "destructive" });
    } catch {
      toast({ title: "Error", description: "Failed to delete component.", variant: "destructive" });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Component, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveComponent = async () => {
    const method = currentComponent ? "PUT" : "POST";
    const url = currentComponent ? `/api/components/${currentComponent.id}` : "/api/components";
    const payload = {
      ...formData,
      purchaseDate: formData.purchaseDate || new Date().toISOString().split("T")[0],
      purchaseCost: formData.purchaseCost || 0,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Request failed");
      const saved = await res.json();

      const updated = currentComponent
        ? components.map(c => c.id === saved.id ? saved : c)
        : [...components, saved];

      setComponents(updated);
      setFilteredComponents(updated);
      toast({ title: currentComponent ? "Updated" : "Added", description: `${saved.name} saved.` });
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch {
      toast({ title: "Error", description: "Could not save component.", variant: "destructive" });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "deployed": return "bg-blue-100 text-blue-800";
      case "available": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "decommissioned": return "bg-gray-100 text-gray-800";
      case "returned": return "bg-purple-100 text-purple-800";
      case "borrowed": return "bg-indigo-100 text-indigo-800";
      case "permanent": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout title="Components | IT Asset Manager">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Components</h1>
          <Button onClick={handleAddComponent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Component
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Component Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search components..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <p>Loading components...</p>
            ) : filteredComponents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Serial Number</th>
                      <th className="px-4 py-3">Model</th>
                      <th className="px-4 py-3">Capacity/Specs</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Assigned To</th>
                      <th className="px-4 py-3">Released By</th>
                      <th className="px-4 py-3">Date Released</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComponents.map(component => (
                      <tr key={component.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{component.name}</td>
                        <td className="px-4 py-3 capitalize">{component.type || component.category}</td>
                        <td className="px-4 py-3">{component.serialNumber}</td>
                        <td className="px-4 py-3">{component.model}</td>
                        <td className="px-4 py-3">{component.capacitySpecs || "N/A"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(component.status)}`}>
                            {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">{component.assignedTo || "Unassigned"}</td>
                        <td className="px-4 py-3">{component.releasedBy || "N/A"}</td>
                        <td className="px-4 py-3">{component.dateReleased || "N/A"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditComponent(component)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteComponent(component)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No components found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {currentComponent && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          itemName={`component ${currentComponent.name}`}
        />
      )}
<Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Add New Component</DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-2 gap-4 py-4">
      {[
        { id: "name", label: "Name" },
        { id: "type", label: "Type" },
        { id: "serialNumber", label: "Serial Number" },
        { id: "model", label: "Model" },
        { id: "manufacturer", label: "Manufacturer" },
        { id: "capacitySpecs", label: "Capacity / Specs" },
        { id: "assignedTo", label: "Assigned To" },
        { id: "releasedBy", label: "Released By" },
        { id: "dateReleased", label: "Date Released", type: "date" },
        { id: "returnedTo", label: "Returned To" },
        { id: "dateReturned", label: "Date Returned", type: "date" }
      ].map(({ id, label, type }) => (
        <div key={id} className="space-y-2">
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            name={id}
            type={type || "text"}
            value={formData[id as keyof typeof formData] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(v) => handleSelectChange("category", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cpu">CPU</SelectItem>
            <SelectItem value="ram">RAM</SelectItem>
            <SelectItem value="storage">Storage</SelectItem>
            <SelectItem value="gpu">GPU</SelectItem>
            <SelectItem value="motherboard">Motherboard</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="deployed">Deployed</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="decommissioned">Decommissioned</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="borrowed">Borrowed</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
      <Button onClick={handleSaveComponent}>Save Component</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Edit Component</DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-2 gap-4 py-4">
      {[
        { id: "name", label: "Name" },
        { id: "type", label: "Type" },
        { id: "serialNumber", label: "Serial Number" },
        { id: "model", label: "Model" },
        { id: "manufacturer", label: "Manufacturer" },
        { id: "capacitySpecs", label: "Capacity / Specs" },
        { id: "assignedTo", label: "Assigned To" },
        { id: "releasedBy", label: "Released By" },
        { id: "dateReleased", label: "Date Released", type: "date" },
        { id: "returnedTo", label: "Returned To" },
        { id: "dateReturned", label: "Date Returned", type: "date" }
      ].map(({ id, label, type }) => (
        <div key={id} className="space-y-2">
          <Label htmlFor={`edit-${id}`}>{label}</Label>
          <Input
            id={`edit-${id}`}
            name={id}
            type={type || "text"}
            value={formData[id as keyof typeof formData] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="edit-category">Category</Label>
        <Select value={formData.category} onValueChange={(v) => handleSelectChange("category", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cpu">CPU</SelectItem>
            <SelectItem value="ram">RAM</SelectItem>
            <SelectItem value="storage">Storage</SelectItem>
            <SelectItem value="gpu">GPU</SelectItem>
            <SelectItem value="motherboard">Motherboard</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-status">Status</Label>
        <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="deployed">Deployed</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="decommissioned">Decommissioned</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="borrowed">Borrowed</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
      <Button onClick={handleSaveComponent}>Update Component</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </Layout>
  );
}
