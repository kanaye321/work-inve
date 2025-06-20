import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { VMInventory } from "@/types";

interface VMFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<VMInventory>) => void;
  vm?: VMInventory | null;
}

const initialFormData: Partial<VMInventory> = {
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
  validity: "available",
  hypervisor: "",
  hostname: "",
  hostModel: "",
  hostIpAddress: "",
  hostOS: "",
  rack: "",
  vmId: "",
  vmName: "",
  vmStatus: "Running",
  vmIpAddress: "",
  internetAccess: false,
  vmOS: "",
  vmOSVersion: "",
  deployedBy: "",
  user: "",
  department: "",
  jiraTicketNumber: "",
  remarks: "",
};

export default function VMFormModal({ isOpen, onClose, onSave, vm }: VMFormModalProps) {
  const [formData, setFormData] = useState<Partial<VMInventory>>(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (vm) {
        setFormData({
          ...vm,
          startDate: vm.startDate.split("T")[0],
          endDate: vm.endDate.split("T")[0],
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, vm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, internetAccess: checked }));
  };

  const handleSelectChange = (name: keyof VMInventory, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{vm ? "Edit VM" : "Create VM"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div>
              <Label>Start Date</Label>
              <Input type="date" name="startDate" value={formData.startDate || ""} onChange={handleChange} required />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" name="endDate" value={formData.endDate || ""} onChange={handleChange} required />
            </div>

            <div>
              <Label>Hypervisor</Label>
              <Input name="hypervisor" value={formData.hypervisor || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Hostname</Label>
              <Input name="hostname" value={formData.hostname || ""} onChange={handleChange} required />
            </div>
            <div>
              <Label>Host Model</Label>
              <Input name="hostModel" value={formData.hostModel || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Host IP Address</Label>
              <Input name="hostIpAddress" value={formData.hostIpAddress || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Host OS</Label>
              <Input name="hostOS" value={formData.hostOS || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Rack</Label>
              <Input name="rack" value={formData.rack || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>VM ID</Label>
              <Input name="vmId" value={formData.vmId || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>VM Name</Label>
              <Input name="vmName" value={formData.vmName || ""} onChange={handleChange} required />
            </div>
            <div>
              <Label>VM Status</Label>
              <Select value={formData.vmStatus} onValueChange={(val) => handleSelectChange("vmStatus", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Running">Running</SelectItem>
                  <SelectItem value="Stopped">Stopped</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>VM IP Address</Label>
              <Input name="vmIpAddress" value={formData.vmIpAddress || ""} onChange={handleChange} required />
            </div>
            <div>
              <Label>VM OS</Label>
              <Input name="vmOS" value={formData.vmOS || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>VM OS Version</Label>
              <Input name="vmOSVersion" value={formData.vmOSVersion || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Deployed By</Label>
              <Input name="deployedBy" value={formData.deployedBy || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>User</Label>
              <Input name="user" value={formData.user || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Department</Label>
              <Input name="department" value={formData.department || ""} onChange={handleChange} />
            </div>
            <div>
              <Label>JIRA Ticket Number</Label>
              <Input name="jiraTicketNumber" value={formData.jiraTicketNumber || ""} onChange={handleChange} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                id="internetAccess"
                checked={formData.internetAccess || false}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="internetAccess">Internet Access</Label>
            </div>
            <div className="col-span-2">
              <Label>Remarks</Label>
              <Textarea name="remarks" rows={3} value={formData.remarks || ""} onChange={handleChange} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{vm ? "Save Changes" : "Create VM"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
