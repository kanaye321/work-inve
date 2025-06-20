import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VMInventory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationDialog from "@/components/assets/DeleteConfirmationDialog";
import ImportExportVM from "@/components/vm-inventory/ImportExportVM";
import VMFormModal from "@/components/vm-inventory/VMFormModal";

export default function VMInventoryPage() {
  const { toast } = useToast();
  const [vms, setVMs] = useState<VMInventory[]>([]);
  const [filteredVMs, setFilteredVMs] = useState<VMInventory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentVM, setCurrentVM] = useState<VMInventory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchVMs = async () => {
    try {
      const res = await fetch("/api/vm-inventory");
      const data = await res.json();
      setVMs(data);
      setFilteredVMs(data);
    } catch (err) {
      toast({ title: "Failed to load VMs", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchVMs();
  }, []);

  const applyFilters = (query: string, status: string) => {
    let result = [...vms];

    if (query) {
      result = result.filter(
        (vm) =>
          vm.vmName.toLowerCase().includes(query) ||
          vm.hostname.toLowerCase().includes(query) ||
          vm.vmIpAddress.toLowerCase().includes(query) ||
          vm.vmOS.toLowerCase().includes(query) ||
          vm.department.toLowerCase().includes(query) ||
          vm.user.toLowerCase().includes(query)
      );
    }

    if (status !== "all") {
      result = result.filter(
        (vm) => vm.vmStatus?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredVMs(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setStatusFilter(value);
    applyFilters(searchQuery, value);
  };

  const handleAddVM = () => {
    setCurrentVM(null);
    setIsAddModalOpen(true);
  };

  const handleEditVM = (vm: VMInventory) => {
    setCurrentVM(vm);
    setIsAddModalOpen(true);
  };

  const handleDeleteVM = async () => {
    if (!currentVM) return;
    try {
      await fetch(`/api/vm-inventory/${currentVM.id}`, {
        method: "DELETE",
      });
      toast({ title: "VM Deleted", variant: "destructive" });
      fetchVMs();
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-green-100 text-green-800";
      case "Stopped":
        return "bg-yellow-100 text-yellow-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      case "Suspended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Layout title="VM Inventory | IT Asset Manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">VM Inventory</h1>
          <Button onClick={handleAddVM}>
            <Plus className="h-4 w-4 mr-2" />
            Create VM
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Virtual Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search VMs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <ImportExportVM vms={vms} onImport={fetchVMs} />
              </div>
            </div>

            {isFilterOpen && (
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <label className="block text-sm font-medium mb-1">
                  Filter by VM Status
                </label>
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full max-w-xs p-2 border rounded"
                >
                  <option value="all">All</option>
                  <option value="Running">Running</option>
                  <option value="Stopped">Stopped</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">VM Name</th>
                    <th className="px-4 py-3">Hostname</th>
                    <th className="px-4 py-3">IP Address</th>
                    <th className="px-4 py-3">OS</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVMs.map((vm) => (
                    <tr key={vm.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{vm.vmName}</td>
                      <td className="px-4 py-3">{vm.hostname}</td>
                      <td className="px-4 py-3">{vm.vmIpAddress}</td>
                      <td className="px-4 py-3">{vm.vmOS}</td>
                      <td className="px-4 py-3">{vm.user}</td>
                      <td className="px-4 py-3">{vm.department}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadge(
                            vm.vmStatus
                          )}`}
                        >
                          {vm.vmStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditVM(vm)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentVM(vm);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredVMs.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center text-gray-500 py-4"
                      >
                        No VMs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <VMFormModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setCurrentVM(null);
          }}
          onSuccess={fetchVMs}
          vm={currentVM}
        />

        {currentVM && (
          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteVM}
            itemName={`VM ${currentVM.vmName}`}
          />
        )}
      </div>
    </Layout>
  );
}
