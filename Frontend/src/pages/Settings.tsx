import { useState } from 'react';
import { Building2, Users, Bell, Save, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useToast } from '@/hooks/use-toast';

const mockUsers = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com', role: 'Admin', active: true },
  { id: '2', name: 'John Smith', email: 'john@hospital.com', role: 'Pharmacist', active: true },
  { id: '3', name: 'Emily Davis', email: 'emily@hospital.com', role: 'Store Manager', active: true },
  { id: '4', name: 'Michael Brown', email: 'michael@hospital.com', role: 'Viewer', active: false },
];

export default function Settings() {
  const { toast } = useToast();
  const [hospitalName, setHospitalName] = useState('City General Hospital');
  const [hospitalAddress, setHospitalAddress] = useState('123 Medical Center Drive');
  const [region, setRegion] = useState('Central Region');
  const [contactEmail, setContactEmail] = useState('admin@cityhospital.com');
  const [contactPhone, setContactPhone] = useState('+1-555-0101');

  const [lowStockDays, setLowStockDays] = useState('7');
  const [overstockMultiplier, setOverstockMultiplier] = useState('3');
  const [expiryWarningDays, setExpiryWarningDays] = useState('90');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your hospital profile and system preferences
        </p>
      </div>

      <Tabs defaultValue="hospital">
        <TabsList>
          <TabsTrigger value="hospital" className="gap-2">
            <Building2 className="h-4 w-4" />
            Hospital Profile
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="h-4 w-4" />
            Alert Settings
          </TabsTrigger>
        </TabsList>

        {/* Hospital Profile */}
        <TabsContent value="hospital" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Information</CardTitle>
              <CardDescription>
                Update your hospital's basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Central Region">Central Region</SelectItem>
                      <SelectItem value="Northern Region">Northern Region</SelectItem>
                      <SelectItem value="Southern Region">Southern Region</SelectItem>
                      <SelectItem value="Eastern Region">Eastern Region</SelectItem>
                      <SelectItem value="Western Region">Western Region</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage users and their access permissions</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.active
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-muted text-muted-foreground'
                          }
                        >
                          {user.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Settings */}
        <TabsContent value="alerts" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Alert Thresholds</CardTitle>
              <CardDescription>
                Configure when alerts should be triggered for stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="lowStock">Low Stock Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="lowStock"
                      type="number"
                      value={lowStockDays}
                      onChange={(e) => setLowStockDays(e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">days of supply</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overstock">Overstock Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="overstock"
                      type="number"
                      value={overstockMultiplier}
                      onChange={(e) => setOverstockMultiplier(e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">× reorder level</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Warning</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="expiry"
                      type="number"
                      value={expiryWarningDays}
                      onChange={(e) => setExpiryWarningDays(e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">days before</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alert summaries and critical notifications via email
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get instant SMS alerts for critical shortages
                  </p>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
              <Button onClick={handleSave} className="mt-4 gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
