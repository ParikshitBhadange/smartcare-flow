import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRightLeft, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  MapPin, 
  Package,
  ArrowRight,
  Building2,
  Edit,
  Eye
} from 'lucide-react';
import { mockTransfers, mockHospitals, mockDrugBatches } from '@/data/mockData';
import { Transfer, TransferStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

const Transfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editQuantity, setEditQuantity] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Form state for new transfer
  const [newTransfer, setNewTransfer] = useState({
    fromHospitalId: '',
    toHospitalId: '',
    drugName: '',
    batchId: '',
    quantity: '',
    justification: '',
  });

  const getStatusBadge = (status: TransferStatus) => {
    const variants: Record<TransferStatus, { class: string; icon: React.ReactNode }> = {
      suggested: { class: 'bg-info/10 text-info border-info/20', icon: <Clock className="h-3 w-3" /> },
      approved: { class: 'bg-success/10 text-success border-success/20', icon: <CheckCircle className="h-3 w-3" /> },
      in_transit: { class: 'bg-warning/10 text-warning border-warning/20', icon: <Truck className="h-3 w-3" /> },
      completed: { class: 'bg-success/10 text-success border-success/20', icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { class: 'bg-critical/10 text-critical border-critical/20', icon: <XCircle className="h-3 w-3" /> },
    };
    return variants[status];
  };

  const getReasonBadge = (reason: Transfer['reason']) => {
    const variants: Record<Transfer['reason'], string> = {
      shortage: 'bg-critical/10 text-critical border-critical/20',
      overstock: 'bg-info/10 text-info border-info/20',
      expiry_risk: 'bg-warning/10 text-warning border-warning/20',
    };
    return variants[reason];
  };

  const filteredTransfers = transfers.filter(t => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return t.status === 'suggested';
    if (activeTab === 'approved') return t.status === 'approved' || t.status === 'in_transit';
    if (activeTab === 'completed') return t.status === 'completed';
    return true;
  });

  const handleApprove = (transfer: Transfer) => {
    setTransfers(prev => prev.map(t => 
      t.id === transfer.id 
        ? { ...t, status: 'approved' as TransferStatus, approvedDate: new Date().toISOString() }
        : t
    ));
    toast({
      title: 'Transfer Approved',
      description: `${transfer.drugName} transfer to ${transfer.toHospitalName} has been approved.`,
    });
    setShowDetailModal(false);
  };

  const handleReject = (transfer: Transfer) => {
    setTransfers(prev => prev.map(t => 
      t.id === transfer.id 
        ? { ...t, status: 'rejected' as TransferStatus }
        : t
    ));
    toast({
      title: 'Transfer Rejected',
      description: `${transfer.drugName} transfer has been rejected.`,
      variant: 'destructive',
    });
    setShowDetailModal(false);
  };

  const handleUpdateQuantity = (transfer: Transfer) => {
    const newQty = parseInt(editQuantity);
    if (isNaN(newQty) || newQty <= 0) {
      toast({ title: 'Invalid quantity', variant: 'destructive' });
      return;
    }
    setTransfers(prev => prev.map(t => 
      t.id === transfer.id ? { ...t, quantity: newQty } : t
    ));
    toast({ title: 'Quantity Updated', description: `New quantity: ${newQty}` });
    setEditQuantity('');
  };

  const handleCreateTransfer = () => {
    const fromHospital = mockHospitals.find(h => h.id === newTransfer.fromHospitalId);
    const toHospital = mockHospitals.find(h => h.id === newTransfer.toHospitalId);
    
    if (!fromHospital || !toHospital || !newTransfer.drugName || !newTransfer.quantity) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const transfer: Transfer = {
      id: `t${Date.now()}`,
      fromHospitalId: newTransfer.fromHospitalId,
      fromHospitalName: fromHospital.name,
      toHospitalId: newTransfer.toHospitalId,
      toHospitalName: toHospital.name,
      drugName: newTransfer.drugName,
      batchId: newTransfer.batchId || 'MANUAL-' + Date.now(),
      quantity: parseInt(newTransfer.quantity),
      reason: 'shortage',
      status: 'suggested',
      suggestedDate: new Date().toISOString(),
      justification: newTransfer.justification || 'Manual transfer request',
    };

    setTransfers(prev => [transfer, ...prev]);
    toast({ title: 'Transfer Request Created', description: 'Your transfer request has been submitted for approval.' });
    setShowCreateModal(false);
    setNewTransfer({ fromHospitalId: '', toHospitalId: '', drugName: '', batchId: '', quantity: '', justification: '' });
  };

  const openDetail = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setEditQuantity(transfer.quantity.toString());
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transfer Management</h1>
          <p className="text-muted-foreground">View suggested transfers and manage redistribution requests</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Transfer
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{transfers.filter(t => t.status === 'suggested').length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{transfers.filter(t => t.status === 'approved').length}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Truck className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{transfers.filter(t => t.status === 'in_transit').length}</p>
                <p className="text-xs text-muted-foreground">In Transit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{transfers.filter(t => t.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Transfer Requests
          </CardTitle>
          <CardDescription>
            AI-suggested and manual transfer requests between hospitals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({transfers.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({transfers.filter(t => t.status === 'suggested').length})</TabsTrigger>
              <TabsTrigger value="approved">In Progress ({transfers.filter(t => t.status === 'approved' || t.status === 'in_transit').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({transfers.filter(t => t.status === 'completed').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Drug</TableHead>
                      <TableHead className="hidden md:table-cell">Route</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="hidden sm:table-cell">Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No transfers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transfer.drugName}</p>
                              <p className="text-xs text-muted-foreground font-mono">{transfer.batchId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="truncate max-w-[120px]">{transfer.fromHospitalName}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{transfer.toHospitalName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{transfer.quantity.toLocaleString()}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className={getReasonBadge(transfer.reason)}>
                              {transfer.reason.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadge(transfer.status).class} flex items-center gap-1 w-fit`}>
                              {getStatusBadge(transfer.status).icon}
                              {transfer.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => openDetail(transfer)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transfer Details</DialogTitle>
            <DialogDescription>
              Review transfer request and take action
            </DialogDescription>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-6">
              {/* Drug Info */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-lg">{selectedTransfer.drugName}</p>
                    <p className="text-sm text-muted-foreground font-mono">{selectedTransfer.batchId}</p>
                  </div>
                  <Badge className={getStatusBadge(selectedTransfer.status).class}>
                    {selectedTransfer.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Route Visualization */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Transfer Route</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 border rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Building2 className="h-4 w-4" />
                      From
                    </div>
                    <p className="font-medium">{selectedTransfer.fromHospitalName}</p>
                  </div>
                  <div className="flex flex-col items-center text-muted-foreground">
                    <ArrowRight className="h-5 w-5" />
                    {selectedTransfer.distance && (
                      <span className="text-xs">{selectedTransfer.distance} km</span>
                    )}
                  </div>
                  <div className="flex-1 p-3 border rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      To
                    </div>
                    <p className="font-medium">{selectedTransfer.toHospitalName}</p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Transfer Quantity</p>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-32"
                    disabled={selectedTransfer.status !== 'suggested'}
                  />
                  {selectedTransfer.status === 'suggested' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUpdateQuantity(selectedTransfer)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  )}
                </div>
              </div>

              {/* Justification */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Justification</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedTransfer.justification}</p>
              </div>

              {/* Reason & Timeline */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Reason</p>
                  <Badge className={`mt-1 ${getReasonBadge(selectedTransfer.reason)}`}>
                    {selectedTransfer.reason.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Suggested Date</p>
                  <p className="font-medium mt-1">
                    {new Date(selectedTransfer.suggestedDate).toLocaleDateString()}
                  </p>
                </div>
                {selectedTransfer.approvedDate && (
                  <div>
                    <p className="text-muted-foreground">Approved Date</p>
                    <p className="font-medium mt-1">
                      {new Date(selectedTransfer.approvedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedTransfer.completedDate && (
                  <div>
                    <p className="text-muted-foreground">Completed Date</p>
                    <p className="font-medium mt-1">
                      {new Date(selectedTransfer.completedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedTransfer?.status === 'suggested' && (
              <>
                <Button variant="outline" onClick={() => handleReject(selectedTransfer)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedTransfer)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {selectedTransfer?.status !== 'suggested' && (
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Transfer Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Transfer Request</DialogTitle>
            <DialogDescription>
              Manually request a drug transfer between hospitals
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Hospital</Label>
                <Select 
                  value={newTransfer.fromHospitalId} 
                  onValueChange={(v) => setNewTransfer(prev => ({ ...prev, fromHospitalId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockHospitals.map(h => (
                      <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Hospital</Label>
                <Select 
                  value={newTransfer.toHospitalId} 
                  onValueChange={(v) => setNewTransfer(prev => ({ ...prev, toHospitalId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockHospitals.filter(h => h.id !== newTransfer.fromHospitalId).map(h => (
                      <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Drug Name</Label>
              <Select 
                value={newTransfer.drugName} 
                onValueChange={(v) => {
                  const batch = mockDrugBatches.find(b => b.drugName === v);
                  setNewTransfer(prev => ({ 
                    ...prev, 
                    drugName: v,
                    batchId: batch?.batchId || ''
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select drug" />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set(mockDrugBatches.map(b => b.drugName))].map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Batch ID</Label>
                <Input 
                  value={newTransfer.batchId}
                  onChange={(e) => setNewTransfer(prev => ({ ...prev, batchId: e.target.value }))}
                  placeholder="e.g., AMX-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input 
                  type="number"
                  value={newTransfer.quantity}
                  onChange={(e) => setNewTransfer(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Justification</Label>
              <Textarea 
                value={newTransfer.justification}
                onChange={(e) => setNewTransfer(prev => ({ ...prev, justification: e.target.value }))}
                placeholder="Explain reason for this transfer request..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTransfer}>
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transfers;