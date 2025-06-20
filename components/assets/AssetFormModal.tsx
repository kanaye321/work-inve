// --- FILE: components/assets/AssetFormModal.tsx ---

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Asset } from "@/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Partial<Asset>) => void;
  asset?: Asset;
}

export default function AssetFormModal({ isOpen, onClose, onSave, asset }: AssetFormModalProps) {
  const [formData, setFormData] = useState<Partial<Asset>>({
    assetTag: "",
    model: "",
    serialNumber: "",
    macAddress: "",
    ipAddress: "",
    status: "available",
    financeChecked: false,
    assignedTo: "",
    dateReleased: "",
    releasedBy: "",
    category: "",
    manufacturer: "",
    location: "",
    notes: "",
  });

  useEffect(() => {
    if (asset) setFormData(asset);
  }, [asset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (field: keyof Asset, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {[
            "assetTag",
            "model",
            "serialNumber",
            "macAddress",
            "ipAddress",
            "assignedTo",
            "dateReleased",
            "releasedBy",
            "manufacturer",
            "location",
            "notes",
          ].map((field) => (
            <div className="space-y-2" key={field}>
              <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</Label>
              <Input
                id={field}
                name={field}
                value={formData[field as keyof Asset] as string || ""}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Dropdown for status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || "available"}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="resigned">Resigned</SelectItem>
                <SelectItem value="replacement">Replacement</SelectItem>
                <SelectItem value="defective">Defective</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown for category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="printer">Printer</SelectItem>
                <SelectItem value="scanner">Scanner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Checkbox for financeChecked */}
          <div className="col-span-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="financeChecked"
              name="financeChecked"
              checked={formData.financeChecked || false}
              onChange={handleChange}
            />
            <Label htmlFor="financeChecked">Finance Checked</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{asset ? "Update Asset" : "Add Asset"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}