import { useState } from "react";
import { Plus, Search, Filter, Download, Edit, Trash } from "lucide-react"; // Removed Key, Calendar as they weren't used directly
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockLicenses } from "@/lib/mockData";
import { License } from "@/types";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog"; // Corrected path
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// Removed unused Select imports

// Helper function to safely format optional dates
const formatOptionalDate = (dateString: string | undefined): string => {
  if (!dateString || typeof dateString !== 'string') {
    return 'N/A'; // Return N/A if undefined, null, or not a string
  }
  try {
    const date = new Date(dateString);
    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    // Format valid date
    return date.toLocaleDateString(undefined, { // Use locale-sensitive formatting
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return 'Error'; // Indicate an error occurred during formatting
  }
};

export default function LicensesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>(licenses); // Initialize with licenses
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLicense, setCurrentLicense] = useState<License | null>(null);
  const [formData, setFormData] = useState<Partial<License>>({
    name: '',
    software: '',
    key: '',
    seats: 1,
    seatsAvailable: 1,
    purchaseDate: new Date().toISOString().split('T')[0], // Default to today
    expirationDate: undefined, // Default to undefined
    purchaseCost: 0,
    notes: ''
  });

  // Update filtered licenses when search query changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredLicenses(licenses);
    } else {
      const filtered = licenses.filter(
        license =>
          license.name.toLowerCase().includes(query) ||
          license.software.toLowerCase().includes(query) ||
          license.key.toLowerCase().includes(query)
      );
      setFilteredLicenses(filtered);
    }
  };

  // Reset form and open Add modal
  const handleAddLicense = () => {
    setCurrentLicense(null);
    setFormData({
      name: '',
      software: '',
      key: '',
      seats: 1,
      seatsAvailable: 1,
      purchaseDate: new Date().toISOString().split('T')[0],
      expirationDate: undefined,
      purchaseCost: 0,
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  // Populate form with existing data and open Edit modal
  const handleEditLicense = (license: License) => {
    setCurrentLicense(license);
    setFormData({
      name: license.name,
      software: license.software,
      key: license.key,
      seats: license.seats,
      seatsAvailable: license.seatsAvailable,
      purchaseDate: license.purchaseDate || '', // Handle potential undefined
      expirationDate: license.expirationDate || '', // Handle potential undefined
      purchaseCost: license.purchaseCost || 0, // Handle potential undefined
      notes: license.notes || ''
    });
    setIsEditModalOpen(true);
  };

  // Set license to delete and open confirmation dialog
  const handleDeleteLicense = (license: License) => {
    setCurrentLicense(license);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion, update state, show toast
  const confirmDelete = () => {
    if (currentLicense) {
      const updatedLicenses = licenses.filter(license => license.id !== currentLicense.id);
      setLicenses(updatedLicenses);
      setFilteredLicenses(updatedLicenses); // Update filtered list as well
      setIsDeleteDialogOpen(false);
      setCurrentLicense(null); // Clear current license
      toast({
        title: "License Deleted",
        description: `"${currentLicense.name}" has been deleted.`,
        variant: "destructive",
      });
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value
    }));
  };

  // Save new or edited license
  const handleSaveLicense = () => {
    // Basic validation (can be expanded)
    if (!formData.name || !formData.software || !formData.key) {
       toast({ title: "Error", description: "Name, Software, and Key are required.", variant: "destructive" });
       return;
    }

    let updatedLicenses: License[];
    let toastMessage = "";

    if (currentLicense) {
      // Edit existing license
      updatedLicenses = licenses.map(license =>
        license.id === currentLicense.id ? { ...license, ...formData, id: license.id } : license // Ensure ID is preserved
      );
      toastMessage = `"${formData.name}" has been updated successfully.`;
      setIsEditModalOpen(false);
    } else {
      // Add new license
      const newLicense: License = {
        id: Date.now(), // Simple unique ID generation
        name: formData.name || '',
        software: formData.software || '',
        key: formData.key || '',
        seats: formData.seats || 1,
        seatsAvailable: formData.seatsAvailable || formData.seats || 1, // Default available to total seats if not specified
        purchaseDate: formData.purchaseDate || undefined,
        expirationDate: formData.expirationDate || undefined,
        purchaseCost: formData.purchaseCost || undefined,
        notes: formData.notes || undefined,
        // Ensure all required fields from License type are present
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedLicenses = [...licenses, newLicense];
      toastMessage = `"${newLicense.name}" has been added successfully.`;
      setIsAddModalOpen(false);
    }

    setLicenses(updatedLicenses);
    setFilteredLicenses(updatedLicenses); // Update filtered list
    setCurrentLicense(null); // Clear current license
    toast({
      title: currentLicense ? "License Updated" : "License Added",
      description: toastMessage,
    });
  };

  // --- Status Calculation Functions ---
  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    try {
      const expDate = new Date(expirationDate);
      if (isNaN(expDate.getTime())) return false; // Invalid date
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return expDate > today && expDate <= thirtyDaysFromNow;
    } catch { return false; }
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    try {
      const expDate = new Date(expirationDate);
      if (isNaN(expDate.getTime())) return false; // Invalid date
      const today = new Date();
      return expDate < today;
    } catch { return false; }
  };

  const getExpirationStatus = (expirationDate?: string): { text: string; className: string } => {
    if (!expirationDate) return { text: "N/A", className: "bg-gray-100 text-gray-800" };
    if (isExpired(expirationDate)) return { text: "Expired", className: "bg-red-100 text-red-800" };
    if (isExpiringSoon(expirationDate)) return { text: "Expiring Soon", className: "bg-yellow-100 text-yellow-800" };
    return { text: "Valid", className: "bg-green-100 text-green-800" };
  };
  // --- End Status Calculation Functions ---

  return (
    <Layout title="Licenses | IT Asset Manager">
      <div className="space-y-6 p-4 md:p-6"> {/* Added padding */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Licenses</h1>
          <Button onClick={handleAddLicense}>
            <Plus className="h-4 w-4 mr-2" />
            Add License
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>License Management</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> {/* Adjusted color */}
                <Input
                  placeholder="Search by name, software, or key..."
                  className="pl-8 w-full" // Ensure full width
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" disabled> {/* Disabled filter/download for now */}
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
            </div>

            {/* Licenses Table */}
            <div className="overflow-x-auto border rounded-md"> {/* Added border */}
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50"> {/* Adjusted styling */}
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Software</th>
                    <th className="px-4 py-3 font-medium">License Key</th>
                    <th className="px-4 py-3 font-medium text-center">Seats</th> {/* Centered */}
                    <th className="px-4 py-3 font-medium text-center">Available</th> {/* Centered */}
                    <th className="px-4 py-3 font-medium">Purchase Date</th>
                    <th className="px-4 py-3 font-medium">Expiration Date</th>
                    <th className="px-4 py-3 font-medium text-center">Status</th> {/* Centered */}
                    <th className="px-4 py-3 font-medium text-right">Cost</th> {/* Right aligned */}
                    <th className="px-4 py-3 font-medium text-center">Actions</th> {/* Centered */}
                  </tr>
                </thead>
                <tbody className="divide-y"> {/* Added divider */}
                  {filteredLicenses.length > 0 ? (
                    filteredLicenses.map((license) => {
                      const status = getExpirationStatus(license.expirationDate);
                      return (
                        <tr key={license.id} className="hover:bg-muted/50"> {/* Adjusted hover */}
                          <td className="px-4 py-3 font-medium">{license.name}</td>
                          <td className="px-4 py-3">{license.software}</td>
                          <td className="px-4 py-3 font-mono text-xs">{license.key}</td>
                          <td className="px-4 py-3 text-center">{license.seats}</td>
                          <td className="px-4 py-3 text-center">{license.seatsAvailable}</td>
                          {/* Use the helper function */}
                          <td className="px-4 py-3">{formatOptionalDate(license.purchaseDate)}</td>
                          {/* Use the helper function */}
                          <td className="px-4 py-3">{formatOptionalDate(license.expirationDate)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                              {status.text}
                            </span>
                          </td>
                          {/* Handle potentially undefined purchaseCost */}
                          <td className="px-4 py-3 text-right">
                             {license.purchaseCost !== undefined ? `$${license.purchaseCost.toFixed(2)}` : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center space-x-1"> {/* Centered actions */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8" // Smaller icon buttons
                                onClick={() => handleEditLicense(license)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive" // Destructive color
                                onClick={() => handleDeleteLicense(license)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-6 text-center text-muted-foreground">
                        No licenses found {searchQuery ? 'matching your search' : ''}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit License Modal Common Structure */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={isEditModalOpen ? setIsEditModalOpen : setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditModalOpen ? 'Edit License' : 'Add New License'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); handleSaveLicense(); }}> {/* Use form element */}
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">License Name <span className="text-destructive">*</span></Label>
                  <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
                </div>
                {/* Software */}
                <div className="space-y-2">
                  <Label htmlFor="software">Software <span className="text-destructive">*</span></Label>
                  <Input id="software" name="software" value={formData.software || ''} onChange={handleChange} required />
                </div>
                {/* Key */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor='key'>License Key <span className="text-destructive">*</span></Label>
                  <Input id='key' name='key' value={formData.key || ''} onChange={handleChange} required />
                </div>
                {/* Seats */}
                <div className="space-y-2">
                  <Label htmlFor="seats">Total Seats</Label>
                  <Input id="seats" name="seats" type="number" min="0" value={formData.seats || 0} onChange={handleChange} />
                </div>
                {/* Available Seats */}
                <div className="space-y-2">
                  <Label htmlFor="seatsAvailable">Available Seats</Label>
                  <Input id="seatsAvailable" name="seatsAvailable" type="number" min="0" value={formData.seatsAvailable || 0} onChange={handleChange} />
                </div>
                {/* Purchase Cost */}
                <div className="space-y-2">
                  <Label htmlFor="purchaseCost">Purchase Cost ($)</Label>
                  <Input id="purchaseCost" name="purchaseCost" type="number" min="0" step="0.01" value={formData.purchaseCost || 0} onChange={handleChange} />
                </div>
                {/* Purchase Date */}
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate || ''} onChange={handleChange} />
                </div>
                {/* Expiration Date */}
                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input id="expirationDate" name="expirationDate" type="date" value={formData.expirationDate || ''} onChange={handleChange} />
                </div>
                {/* Notes */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => isEditModalOpen ? setIsEditModalOpen(false) : setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditModalOpen ? 'Update License' : 'Add License'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {currentLicense && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          itemName={`license "${currentLicense.name}"`} // More specific item name
          itemType="license" // Added missing itemType prop
        />
      )}
    </Layout>
  );
}