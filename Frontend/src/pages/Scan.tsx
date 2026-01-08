import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QrCode, Camera, Package, MapPin, Calendar, Building2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { mockDrugBatches } from '@/data/mockData';
import { DrugBatch } from '@/types';
import { toast } from '@/hooks/use-toast';

const sampleScannedData: DrugBatch = {
  id: 'scanned-1',
  drugName: 'Ciprofloxacin 500mg',
  batchId: 'CIP-2024-089',
  quantity: 500,
  unit: 'tablets',
  location: 'Receiving Dock',
  expiryDate: '2025-11-30',
  manufacturer: 'AntiBio Labs',
  status: 'normal',
  hospitalId: 'h1',
  category: 'Antibiotics',
  reorderLevel: 200,
  lastUpdated: new Date().toISOString(),
};

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBatch, setScannedBatch] = useState<DrugBatch | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [action, setAction] = useState<'update' | 'receive' | 'add'>('update');

  const handleSimulateScan = () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      // Randomly pick between sample data or existing batch
      const useExisting = Math.random() > 0.5;
      if (useExisting && mockDrugBatches.length > 0) {
        const randomBatch = mockDrugBatches[Math.floor(Math.random() * mockDrugBatches.length)];
        setScannedBatch(randomBatch);
      } else {
        setScannedBatch(sampleScannedData);
      }
      setIsScanning(false);
    }, 1500);
  };

  const handleManualEntry = (batchId: string) => {
    const foundBatch = mockDrugBatches.find(b => b.batchId.toLowerCase() === batchId.toLowerCase());
    if (foundBatch) {
      setScannedBatch(foundBatch);
    } else {
      toast({
        title: 'Batch Not Found',
        description: 'No batch found with that ID. Try scanning or check the batch ID.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: DrugBatch['status']) => {
    const variants: Record<DrugBatch['status'], { class: string; label: string }> = {
      normal: { class: 'bg-success/10 text-success border-success/20', label: 'On Time' },
      low: { class: 'bg-warning/10 text-warning border-warning/20', label: 'Low Stock' },
      overstock: { class: 'bg-info/10 text-info border-info/20', label: 'Overstock' },
      near_expiry: { class: 'bg-warning/10 text-warning border-warning/20', label: 'Near Expiry' },
      expired: { class: 'bg-critical/10 text-critical border-critical/20', label: 'Expired' },
    };
    return variants[status] || variants.normal;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'Expired', class: 'text-critical' };
    } else if (daysUntilExpiry <= 30) {
      return { status: `${daysUntilExpiry} days left`, class: 'text-critical' };
    } else if (daysUntilExpiry <= 90) {
      return { status: `${daysUntilExpiry} days left`, class: 'text-warning' };
    } else {
      return { status: `${daysUntilExpiry} days left`, class: 'text-success' };
    }
  };

  const handleAction = () => {
    toast({
      title: action === 'update' ? 'Location Updated' : action === 'receive' ? 'Batch Received' : 'Added to Inventory',
      description: `${scannedBatch?.drugName} has been ${action === 'update' ? 'moved to ' + newLocation : action === 'receive' ? 'marked as received' : 'added to inventory'}.`,
    });
    setShowUpdateModal(false);
    setScannedBatch(null);
    setNewLocation('');
  };

  const clearScan = () => {
    setScannedBatch(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">QR Code Scanner</h1>
        <p className="text-muted-foreground">Scan medicine batches to track, update location, or add to inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scan QR Code
            </CardTitle>
            <CardDescription>
              Position the QR code within the camera frame or enter batch ID manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Camera Placeholder */}
            <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
              {isScanning ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <QrCode className="h-16 w-16 text-primary animate-pulse" />
                    <div className="absolute inset-0 border-2 border-primary rounded animate-ping" />
                  </div>
                  <p className="text-muted-foreground">Scanning...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <QrCode className="h-16 w-16" />
                  <p>Camera preview area</p>
                  <p className="text-sm">Click "Scan QR" to simulate a scan</p>
                </div>
              )}
              
              {/* Scanner overlay lines */}
              <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
            </div>

            <Button 
              onClick={handleSimulateScan} 
              className="w-full" 
              size="lg"
              disabled={isScanning}
            >
              <Camera className="h-5 w-5 mr-2" />
              {isScanning ? 'Scanning...' : 'Scan QR Code'}
            </Button>

            {/* Manual Entry */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or enter manually</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Batch ID (e.g., AMX-2024-001)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleManualEntry((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <Button variant="outline" onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  handleManualEntry(input.value);
                }}>
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scanned Result Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Scanned Batch Details
            </CardTitle>
            <CardDescription>
              {scannedBatch ? 'Review batch information and take action' : 'Scan a QR code to view batch details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scannedBatch ? (
              <div className="space-y-6">
                {/* Drug Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{scannedBatch.drugName}</h3>
                      <p className="text-sm text-muted-foreground">{scannedBatch.manufacturer}</p>
                    </div>
                    <Badge className={getStatusBadge(scannedBatch.status).class}>
                      {getStatusBadge(scannedBatch.status).label}
                    </Badge>
                  </div>

                  {/* Status Chips */}
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const expiryInfo = getExpiryStatus(scannedBatch.expiryDate);
                      return (
                        <Badge variant="outline" className={expiryInfo.class}>
                          <Clock className="h-3 w-3 mr-1" />
                          {expiryInfo.status}
                        </Badge>
                      );
                    })()}
                    {scannedBatch.quantity < scannedBatch.reorderLevel && (
                      <Badge variant="outline" className="text-warning border-warning">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Below Reorder Level
                      </Badge>
                    )}
                    {scannedBatch.quantity > scannedBatch.reorderLevel * 3 && (
                      <Badge variant="outline" className="text-info border-info">
                        <Package className="h-3 w-3 mr-1" />
                        High Stock
                      </Badge>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Batch ID</p>
                      <p className="font-mono text-sm font-medium">{scannedBatch.batchId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="text-sm font-medium">{scannedBatch.quantity.toLocaleString()} {scannedBatch.unit}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Location
                      </p>
                      <p className="text-sm font-medium">{scannedBatch.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Expiry Date
                      </p>
                      <p className="text-sm font-medium">{new Date(scannedBatch.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="text-sm font-medium">{scannedBatch.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> Reorder Level
                      </p>
                      <p className="text-sm font-medium">{scannedBatch.reorderLevel.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button 
                    onClick={() => { setAction('update'); setShowUpdateModal(true); }}
                    variant="outline"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Update Location
                  </Button>
                  <Button 
                    onClick={() => { setAction('receive'); setShowUpdateModal(true); }}
                    variant="outline"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Received
                  </Button>
                  <Button 
                    onClick={() => { setAction('add'); setShowUpdateModal(true); }}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Add to Inventory
                  </Button>
                </div>

                <Button variant="ghost" className="w-full" onClick={clearScan}>
                  Clear & Scan Another
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <QrCode className="h-16 w-16 mb-4 opacity-50" />
                <p>No batch scanned yet</p>
                <p className="text-sm">Scan a QR code or enter a batch ID to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>Your last scanned batches from this session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDrugBatches.slice(0, 4).map((batch) => (
              <div
                key={batch.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setScannedBatch(batch)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className={`text-xs ${getStatusBadge(batch.status).class}`}>
                    {getStatusBadge(batch.status).label}
                  </Badge>
                </div>
                <p className="font-medium text-sm truncate">{batch.drugName}</p>
                <p className="text-xs text-muted-foreground font-mono">{batch.batchId}</p>
                <p className="text-xs text-muted-foreground mt-1">{batch.location}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'update' ? 'Update Location' : action === 'receive' ? 'Mark as Received' : 'Add to Inventory'}
            </DialogTitle>
            <DialogDescription>
              {action === 'update' 
                ? 'Enter the new storage location for this batch'
                : action === 'receive'
                ? 'Confirm receipt of this batch into your facility'
                : 'Add this batch to your hospital inventory'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{scannedBatch?.drugName}</p>
              <p className="text-sm text-muted-foreground">Batch: {scannedBatch?.batchId}</p>
            </div>

            {action === 'update' && (
              <div className="space-y-2">
                <Label htmlFor="location">New Location</Label>
                <Select value={newLocation} onValueChange={setNewLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Store A - Shelf 1">Store A - Shelf 1</SelectItem>
                    <SelectItem value="Store A - Shelf 2">Store A - Shelf 2</SelectItem>
                    <SelectItem value="Store A - Shelf 3">Store A - Shelf 3</SelectItem>
                    <SelectItem value="Store B - Shelf 1">Store B - Shelf 1</SelectItem>
                    <SelectItem value="Store B - Shelf 2">Store B - Shelf 2</SelectItem>
                    <SelectItem value="Cold Storage 1">Cold Storage 1</SelectItem>
                    <SelectItem value="Cold Storage 2">Cold Storage 2</SelectItem>
                    <SelectItem value="Emergency Cabinet">Emergency Cabinet</SelectItem>
                    <SelectItem value="Surgical Store">Surgical Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAction} disabled={action === 'update' && !newLocation}>
              {action === 'update' ? 'Update Location' : action === 'receive' ? 'Confirm Receipt' : 'Add to Inventory'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scan;