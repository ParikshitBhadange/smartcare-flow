import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit2, Save, X, Loader2, Package, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { drugCategories } from '@/data/mockData';
import { DrugBatch, BatchStatus } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const statusConfig: Record<BatchStatus, { label: string; className: string }> = {
  normal: { label: 'Normal', className: 'bg-success/10 text-success border-success/20' },
  low: { label: 'Low Stock', className: 'bg-critical/10 text-critical border-critical/20' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-500/10 text-red-600 border-red-500/20' },
  overstock: { label: 'Overstock', className: 'bg-warning/10 text-warning border-warning/20' },
  near_expiry: { label: 'Near Expiry', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  expired: { label: 'Expired', className: 'bg-critical/10 text-critical border-critical/20' },
};

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<DrugBatch | null>(null);
  const [drugBatches, setDrugBatches] = useState<DrugBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<DrugBatch>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  // Form state for new batch
  const [formData, setFormData] = useState({
    drugName: '',
    batchId: '',
    quantity: '',
    unit: 'tablets',
    ratePerUnit: '',
    expiryDate: '',
    manufacturer: '',
    category: '',
    reorderLevel: '',
  });

  // Fetch drug batches from API for current user
  const fetchDrugBatches = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/drug-batches?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch drug batches');
      const data = await response.json();
      // Map MongoDB _id to id for compatibility
      const mappedData = data.map((batch: any) => ({
        ...batch,
        id: batch._id || batch.id,
      }));
      setDrugBatches(mappedData);
    } catch (error) {
      console.error('Error fetching drug batches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load drug batches. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDrugBatches();
    }
  }, [user?.id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      drugName: '',
      batchId: '',
      quantity: '',
      unit: 'tablets',
      ratePerUnit: '',
      expiryDate: '',
      manufacturer: '',
      category: '',
      reorderLevel: '',
    });
  };

  // Handle form submission
  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.drugName || !formData.batchId || !formData.quantity || 
        !formData.ratePerUnit || !formData.expiryDate || !formData.manufacturer || 
        !formData.category || !formData.reorderLevel) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add a batch.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/api/drug-batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          reorderLevel: Number(formData.reorderLevel),
          ratePerUnit: Number(formData.ratePerUnit),
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add drug batch');
      }

      const newBatch = await response.json();
      
      // Add to local state
      setDrugBatches(prev => [{
        ...newBatch,
        id: newBatch._id || newBatch.id,
      }, ...prev]);
      
      toast({
        title: 'Success',
        description: `${formData.drugName} batch added successfully!`,
      });
      
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Error adding drug batch:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add drug batch. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing a batch
  const startEditing = (batch: DrugBatch) => {
    setEditingBatchId(batch.id);
    setEditFormData({
      drugName: batch.drugName,
      quantity: batch.quantity,
      ratePerUnit: batch.ratePerUnit,
      reorderLevel: batch.reorderLevel,
      expiryDate: batch.expiryDate,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingBatchId(null);
    setEditFormData({});
  };

  // Handle edit input changes
  const handleEditChange = (field: string, value: string | number) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save edited batch
  const saveEdit = async (batchId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/drug-batches/${batchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editFormData,
          quantity: Number(editFormData.quantity),
          ratePerUnit: Number(editFormData.ratePerUnit),
          reorderLevel: Number(editFormData.reorderLevel),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update batch');
      }

      const updatedBatch = await response.json();
      
      setDrugBatches(prev => prev.map(b => 
        b.id === batchId ? { ...updatedBatch, id: updatedBatch._id || updatedBatch.id } : b
      ));
      
      toast({
        title: 'Success',
        description: 'Batch updated successfully!',
      });
      
      cancelEditing();
    } catch (error) {
      console.error('Error updating batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to update batch. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Delete batch
  const deleteBatch = async (batchId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/drug-batches/${batchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete batch');
      }
      
      setDrugBatches(prev => prev.filter(b => b.id !== batchId));
      
      toast({
        title: 'Deleted',
        description: 'Batch deleted successfully.',
      });
      
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete batch. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredBatches = useMemo(() => {
    return drugBatches.filter((batch) => {
      const matchesSearch =
        batch.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.batchId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || batch.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [drugBatches, searchQuery, statusFilter, categoryFilter]);

  // Calculate totals
  const totalStockValue = useMemo(() => {
    return drugBatches.reduce((sum, b) => sum + (b.totalCost || 0), 0);
  }, [drugBatches]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all medicine batches • Total Value: ₹{totalStockValue.toLocaleString()}
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New Batch
        </Button>
      </div>

      {/* Add New Batch Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Drug Batch</DialogTitle>
            <DialogDescription>
              Enter the details for the new medicine batch
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBatch} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drugName">Drug Name *</Label>
                <Input
                  id="drugName"
                  name="drugName"
                  placeholder="e.g., Amoxicillin 500mg"
                  value={formData.drugName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchId">Batch ID *</Label>
                <Input
                  id="batchId"
                  name="batchId"
                  placeholder="e.g., AMX-2024-001"
                  value={formData.batchId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="e.g., 1000"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => handleSelectChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="capsules">Capsules</SelectItem>
                    <SelectItem value="vials">Vials</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="doses">Doses</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ratePerUnit">Rate Per Unit (₹) *</Label>
                <Input
                  id="ratePerUnit"
                  name="ratePerUnit"
                  type="number"
                  placeholder="e.g., 10.50"
                  value={formData.ratePerUnit}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {drugCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  placeholder="e.g., PharmaCorp Inc."
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="reorderLevel">Reorder Level *</Label>
                <Input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  placeholder="Minimum quantity before reordering"
                  value={formData.reorderLevel}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Batch
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Batch?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the batch from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirmId && deleteBatch(deleteConfirmId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by drug name or batch ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                  <SelectItem value="near_expiry">Near Expiry</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {drugCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Drug Batches ({filteredBatches.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading batches...</span>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No drug batches found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {drugBatches.length === 0 
                  ? 'Get started by adding your first drug batch.' 
                  : 'Try adjusting your search or filters.'}
              </p>
              {drugBatches.length === 0 && (
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Batch
                </Button>
              )}
            </div>
          ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Batch ID</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Rate (₹)</TableHead>
                  <TableHead className="text-right">Total (₹)</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">
                      {editingBatchId === batch.id ? (
                        <Input
                          value={editFormData.drugName || ''}
                          onChange={(e) => handleEditChange('drugName', e.target.value)}
                          className="h-8 w-32"
                        />
                      ) : (
                        batch.drugName
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{batch.batchId}</TableCell>
                    <TableCell className="text-right">
                      {editingBatchId === batch.id ? (
                        <Input
                          type="number"
                          value={editFormData.quantity || ''}
                          onChange={(e) => handleEditChange('quantity', e.target.value)}
                          className="h-8 w-20"
                          min="0"
                        />
                      ) : (
                        `${batch.quantity.toLocaleString()} ${batch.unit}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingBatchId === batch.id ? (
                        <Input
                          type="number"
                          value={editFormData.ratePerUnit || ''}
                          onChange={(e) => handleEditChange('ratePerUnit', e.target.value)}
                          className="h-8 w-20"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        `₹${(batch.ratePerUnit || 0).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{(batch.totalCost || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {editingBatchId === batch.id ? (
                        <Input
                          type="date"
                          value={editFormData.expiryDate || ''}
                          onChange={(e) => handleEditChange('expiryDate', e.target.value)}
                          className="h-8 w-32"
                        />
                      ) : (
                        format(new Date(batch.expiryDate), 'MMM dd, yyyy')
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[batch.status]?.className || ''}>
                        {statusConfig[batch.status]?.label || batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {editingBatchId === batch.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => saveEdit(batch.id)}
                              className="h-8 w-8 text-green-600"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={cancelEditing}
                              className="h-8 w-8 text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedBatch(batch)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditing(batch)}
                              className="h-8 w-8"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConfirmId(batch.id)}
                              className="h-8 w-8 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Details Modal */}
      <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Batch Details</DialogTitle>
            <DialogDescription>
              View detailed information about this medicine batch
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Drug Name</p>
                  <p className="font-medium">{selectedBatch.drugName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch ID</p>
                  <p className="font-mono">{selectedBatch.batchId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">
                    {selectedBatch.quantity.toLocaleString()} {selectedBatch.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rate Per Unit</p>
                  <p className="font-medium">₹{(selectedBatch.ratePerUnit || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="font-medium text-lg">₹{(selectedBatch.totalCost || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={statusConfig[selectedBatch.status]?.className || ''}
                  >
                    {statusConfig[selectedBatch.status]?.label || selectedBatch.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedBatch.expiryDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{selectedBatch.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedBatch.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reorder Level</p>
                  <p className="font-medium">{selectedBatch.reorderLevel.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {format(new Date(selectedBatch.lastUpdated), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => {
                    startEditing(selectedBatch);
                    setSelectedBatch(null);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Batch
                </Button>
                <Button variant="outline" onClick={() => setSelectedBatch(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
