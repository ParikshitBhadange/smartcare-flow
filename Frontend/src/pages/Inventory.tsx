import { useState, useMemo } from 'react';
import { Search, Filter, Plus, Eye, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { mockDrugBatches, drugCategories } from '@/data/mockData';
import { DrugBatch, BatchStatus } from '@/types';
import { format } from 'date-fns';

const statusConfig: Record<BatchStatus, { label: string; className: string }> = {
  normal: { label: 'Normal', className: 'bg-success/10 text-success border-success/20' },
  low: { label: 'Low Stock', className: 'bg-critical/10 text-critical border-critical/20' },
  overstock: { label: 'Overstock', className: 'bg-warning/10 text-warning border-warning/20' },
  near_expiry: { label: 'Near Expiry', className: 'bg-warning/10 text-warning border-warning/20' },
  expired: { label: 'Expired', className: 'bg-critical/10 text-critical border-critical/20' },
};

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<DrugBatch | null>(null);

  const filteredBatches = useMemo(() => {
    return mockDrugBatches.filter((batch) => {
      const matchesSearch =
        batch.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.batchId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || batch.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all medicine batches in your facility
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Batch
        </Button>
      </div>

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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Batch ID</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.drugName}</TableCell>
                    <TableCell className="font-mono text-sm">{batch.batchId}</TableCell>
                    <TableCell className="text-right">
                      {batch.quantity.toLocaleString()} {batch.unit}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{batch.location}</TableCell>
                    <TableCell>{format(new Date(batch.expiryDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[batch.status].className}>
                        {statusConfig[batch.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedBatch(batch)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedBatch.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedBatch.expiryDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={statusConfig[selectedBatch.status].className}
                  >
                    {statusConfig[selectedBatch.status].label}
                  </Badge>
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
                <Button className="flex-1 gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Mark for Transfer
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
