import { useState } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash, Shield, Laptop, Copy } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockBitLockerKeys, mockAssets } from '@/lib/mockData';
import { BitLockerKey } from '@/types';
import { useToast } from '@/hooks/use-toast';
import DeleteConfirmationDialog from '@/components/assets/DeleteConfirmationDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function BitLockerPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [bitlockerKeys, setBitlockerKeys] = useState<BitLockerKey[]>(mockBitLockerKeys);
  const [filteredKeys, setFilteredKeys] = useState<BitLockerKey[]>(mockBitLockerKeys);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState<BitLockerKey | null>(null);
  const [formData, setFormData] = useState<Partial<BitLockerKey>>({
    assetId: '',
    serialNumber: '',
    recoveryKey: '',
    notes: ''
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredKeys(bitlockerKeys);
    } else {
      const filtered = bitlockerKeys.filter(
        key => 
          key.serialNumber.toLowerCase().includes(query) ||
          key.recoveryKey.toLowerCase().includes(query) ||
          getAssetName(key.assetId).toLowerCase().includes(query)
      );
      setFilteredKeys(filtered);
    }
  };
  
  // Helper function to get asset name from ID
  const getAssetName = (assetId: string) => {
    // Parse assetId to number for comparison with asset.id (which is number)
    const asset = mockAssets.find(asset => asset.id === parseInt(assetId, 10)); 
    return asset ? asset.model : 'Unknown Asset'; // Use model or a placeholder
  };
  
  const handleAddKey = () => {
    setCurrentKey(null);
    setFormData({
      assetId: '',
      serialNumber: '',
      recoveryKey: '',
      notes: ''
    });
    setIsAddModalOpen(true);
  };
  
  const handleEditKey = (key: BitLockerKey) => {
    setCurrentKey(key);
    setFormData({
      assetId: key.assetId,
      serialNumber: key.serialNumber,
      recoveryKey: key.recoveryKey,
      notes: key.notes || ''
    });
    setIsEditModalOpen(true);
  };
  
  const handleDeleteKey = (key: BitLockerKey) => {
    setCurrentKey(key);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (currentKey) {
      const updatedKeys = bitlockerKeys.filter(key => key.id !== currentKey.id);
      setBitlockerKeys(updatedKeys);
      setFilteredKeys(updatedKeys);
      setIsDeleteDialogOpen(false);
      toast({
        title: 'BitLocker Key Deleted',
        description: `Recovery key for ${getAssetName(currentKey.assetId)} has been deleted.`,
        variant: 'destructive',
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to Clipboard',
        description: 'Recovery key has been copied to clipboard.',
      });
    }).catch(err => {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy recovery key to clipboard.',
        variant: 'destructive',
      });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveKey = () => {
    if (!formData.assetId || !formData.serialNumber || !formData.recoveryKey) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (currentKey) {
      // Edit existing key
      const updatedKeys = bitlockerKeys.map(key => 
        key.id === currentKey.id ? { 
          ...key, 
          assetId: formData.assetId || key.assetId,
          serialNumber: formData.serialNumber || key.serialNumber,
          recoveryKey: formData.recoveryKey || key.recoveryKey,
          notes: formData.notes,
          lastAccessed: new Date().toISOString()
        } : key
      );
      setBitlockerKeys(updatedKeys);
      setFilteredKeys(updatedKeys);
      setIsEditModalOpen(false);
      toast({
        title: 'BitLocker Key Updated',
        description: `Recovery key for ${getAssetName(formData.assetId || '')} has been updated.`,
      });
    } else {
      // Add new key
      const newKey: BitLockerKey = {
        id: `bitlocker-${Date.now()}`,
        assetId: formData.assetId || '',
        serialNumber: formData.serialNumber || '',
        recoveryKey: formData.recoveryKey || '',
        createdAt: new Date().toISOString(),
        notes: formData.notes
      };
      
      const updatedKeys = [...bitlockerKeys, newKey];
      setBitlockerKeys(updatedKeys);
      setFilteredKeys(updatedKeys);
      setIsAddModalOpen(false);
      toast({
        title: 'BitLocker Key Added',
        description: `Recovery key for ${getAssetName(newKey.assetId)} has been added.`,
      });
    }
  };

  return (
    <Layout title='BitLocker | IT Asset Manager'>
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <h1 className='text-2xl font-bold tracking-tight'>BitLocker Recovery Keys</h1>
          <Button onClick={handleAddKey}>
            <Plus className='h-4 w-4 mr-2' />
            Add Recovery Key
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>BitLocker Key Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4 mb-6'>
              <div className='relative flex-1'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
                <Input
                  placeholder='Search by serial number, recovery key, or device name...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='icon'>
                  <Filter className='h-4 w-4' />
                </Button>
                <Button variant='outline' size='icon'>
                  <Download className='h-4 w-4' />
                </Button>
              </div>
            </div>
            
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3'>Device</th>
                    <th className='px-4 py-3'>Serial Number</th>
                    <th className='px-4 py-3'>Recovery Key</th>
                    <th className='px-4 py-3'>Created</th>
                    <th className='px-4 py-3'>Last Accessed</th>
                    <th className='px-4 py-3'>Notes</th>
                    <th className='px-4 py-3'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKeys.length > 0 ? (
                    filteredKeys.map((key) => (
                      <tr key={key.id} className='border-b hover:bg-gray-50'>
                        <td className='px-4 py-3 font-medium'>
                          <div className='flex items-center'>
                            <Laptop className='h-4 w-4 mr-2 text-gray-500' />
                            {getAssetName(key.assetId)}
                          </div>
                        </td>
                        <td className='px-4 py-3'>{key.serialNumber}</td>
                        <td className='px-4 py-3'>
                          <div className='flex items-center'>
                            <span className='font-mono text-xs mr-2'>{key.recoveryKey}</span>
                            <Button 
                              variant='ghost' 
                              size='icon' 
                              className='h-6 w-6'
                              onClick={() => copyToClipboard(key.recoveryKey)}
                            >
                              <Copy className='h-3 w-3' />
                            </Button>
                          </div>
                        </td>
                        <td className='px-4 py-3 text-xs'>{new Date(key.createdAt).toLocaleDateString()}</td>
                        <td className='px-4 py-3 text-xs'>{key.lastAccessed ? new Date(key.lastAccessed).toLocaleDateString() : 'Never'}</td>
                        <td className='px-4 py-3'>{key.notes || 'N/A'}</td>
                        <td className='px-4 py-3'>
                          <div className='flex items-center space-x-2'>
                            <Button 
                              variant='ghost' 
                              size='icon'
                              onClick={() => handleEditKey(key)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button 
                              variant='ghost' 
                              size='icon'
                              onClick={() => handleDeleteKey(key)}
                            >
                              <Trash className='h-4 w-4' />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className='px-4 py-6 text-center text-gray-500'>
                        No BitLocker keys found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add BitLocker Key Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Add New BitLocker Recovery Key</DialogTitle>
          </DialogHeader>
          
          <div className='space-y-4 py-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='assetId'>Device</Label>
                <Select 
                  value={formData.assetId} 
                  onValueChange={(value) => handleSelectChange('assetId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select device' />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAssets.map(asset => (
                      <SelectItem key={asset.id} value={String(asset.id)}> {/* Convert number to string */}
                        {asset.model} ({asset.assetTag}) {/* Display model and tag */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='serialNumber'>Serial Number</Label>
                <Input 
                  id='serialNumber' 
                  name='serialNumber' 
                  value={formData.serialNumber} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='recoveryKey'>Recovery Key</Label>
                <Input 
                  id='recoveryKey' 
                  name='recoveryKey' 
                  value={formData.recoveryKey} 
                  onChange={handleChange} 
                  required 
                  placeholder='Format: 123456-123456-123456-123456-123456-123456-123456-123456'
                />
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='notes'>Notes</Label>
                <Textarea 
                  id='notes' 
                  name='notes' 
                  value={formData.notes} 
                  onChange={handleChange} 
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveKey}>
              Add Recovery Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit BitLocker Key Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Edit BitLocker Recovery Key</DialogTitle>
          </DialogHeader>
          
          <div className='space-y-4 py-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-assetId'>Device</Label>
                <Select 
                  value={formData.assetId} 
                  onValueChange={(value) => handleSelectChange('assetId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select device' />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAssets.map(asset => (
                      <SelectItem key={asset.id} value={String(asset.id)}> {/* Convert number to string */}
                         {asset.model} ({asset.assetTag}) {/* Display model and tag */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='edit-serialNumber'>Serial Number</Label>
                <Input 
                  id='edit-serialNumber' 
                  name='serialNumber' 
                  value={formData.serialNumber} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='edit-recoveryKey'>Recovery Key</Label>
                <Input 
                  id='edit-recoveryKey' 
                  name='recoveryKey' 
                  value={formData.recoveryKey} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='edit-notes'>Notes</Label>
                <Textarea 
                  id='edit-notes' 
                  name='notes' 
                  value={formData.notes} 
                  onChange={handleChange} 
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveKey}>
              Update Recovery Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      {currentKey && (
        <DeleteConfirmationDialog 
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          itemName={`BitLocker key for ${getAssetName(currentKey.assetId)}`}
        />
      )}
    </Layout>
  );
}