import { useUser } from '@clerk/clerk-react';
import { Package, DollarSign, Clock, AlertTriangle, Building2, TrendingDown, Banknote } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ConsumptionChart } from '@/components/dashboard/ConsumptionChart';
import { ShortageList } from '@/components/dashboard/ShortageList';
import { OverstockList } from '@/components/dashboard/OverstockList';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { RegionHeatMap } from '@/components/dashboard/RegionHeatMap';
import { CriticalDrugsTable } from '@/components/dashboard/CriticalDrugsTable';

// Mock data (you'll need to import these from your actual data file)
const mockKPIData = {
  totalSKUs: 1247,
  totalStockValue: 8500000,
  imminentExpiryBatches: 23,
  activeShortageItems: 12
};

const mockStateKPIData = {
  hospitalsWithShortage: 34,
  totalExcessStock: 45000000,
  atRiskExpiryValue: 12000000
};

const mockConsumptionData = [
  { month: 'Jan', forecast: 4000, actual: 3800 },
  { month: 'Feb', forecast: 4200, actual: 4100 },
  { month: 'Mar', forecast: 4500, actual: 4300 },
  { month: 'Apr', forecast: 4300, actual: 4500 },
  { month: 'May', forecast: 4600, actual: 4400 },
  { month: 'Jun', forecast: 4800, actual: 4900 },
];

const mockActivityItems = [
  {
    id: '1',
    type: 'transfer' as const,
    title: 'Transfer Approved',
    description: 'Paracetamol 500mg - 5000 units to City Hospital',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'approved'
  },
  {
    id: '2',
    type: 'alert' as const,
    title: 'Low Stock Alert',
    description: 'Insulin Glargine below reorder level',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'critical'
  },
  {
    id: '3',
    type: 'delivery' as const,
    title: 'Delivery Received',
    description: 'Amoxicillin 250mg - 10000 units',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: 'completed'
  }
];

const mockRegionData = [
  { region: 'North Region', shortageIntensity: 75 },
  { region: 'South Region', shortageIntensity: 45 },
  { region: 'East Region', shortageIntensity: 60 },
  { region: 'West Region', shortageIntensity: 30 },
];

const mockCriticalDrugs = [
  {
    drugName: 'Epinephrine 1mg/mL',
    hospitalsShort: 12,
    hospitalsExcess: 3,
    actionNeeded: 'Urgent Redistribution'
  },
  {
    drugName: 'Insulin Glargine 100U/mL',
    hospitalsShort: 8,
    hospitalsExcess: 5,
    actionNeeded: 'Transfer Initiated'
  },
  {
    drugName: 'Paracetamol 650mg',
    hospitalsShort: 15,
    hospitalsExcess: 2,
    actionNeeded: 'Emergency Order'
  }
];

export default function Dashboard() {
  const { user } = useUser();
  
  // For demo purposes, treat the first user as hospital admin
  // In production, you'd store role in user metadata
  const isHospitalAdmin = user?.publicMetadata?.role === 'hospital_admin' || true;

  const shortageItems = [
    { drugName: 'Epinephrine 1mg/mL', quantity: 25, reorderLevel: 50, severity: 'critical' as const },
    { drugName: 'Paracetamol 650mg', quantity: 150, reorderLevel: 500, severity: 'high' as const },
    { drugName: 'Insulin Glargine', quantity: 80, reorderLevel: 100, severity: 'medium' as const },
  ];

  const overstockItems = [
    { drugName: 'Atorvastatin 20mg', quantity: 8500, optimalLevel: 2000, excessPercentage: 325 },
    { drugName: 'Metformin 500mg', quantity: 12000, optimalLevel: 5000, excessPercentage: 140 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {isHospitalAdmin ? 'Hospital inventory overview' : 'State-wide logistics overview'}
        </p>
      </div>

      {isHospitalAdmin ? (
        <>
          {/* Hospital Admin KPIs */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard 
              title="Total SKUs" 
              value={mockKPIData.totalSKUs} 
              icon={Package} 
              trend={{ value: 5.2, isPositive: true }} 
            />
            <KPICard 
              title="Stock Value" 
              value={`₹${(mockKPIData.totalStockValue / 100000).toFixed(1)}L`} 
              icon={DollarSign} 
              subtitle="Current inventory value" 
            />
            <KPICard 
              title="Near Expiry" 
              value={mockKPIData.imminentExpiryBatches} 
              icon={Clock} 
              variant="warning" 
              subtitle="Batches expiring in 90 days" 
            />
            <KPICard 
              title="Active Shortages" 
              value={mockKPIData.activeShortageItems} 
              icon={AlertTriangle} 
              variant="critical" 
              trend={{ value: 8.3, isPositive: false }} 
            />
          </div>

          {/* Charts and Lists */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ConsumptionChart data={mockConsumptionData} />
            <ActivityFeed items={mockActivityItems} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ShortageList items={shortageItems} onViewAll={() => {}} />
            <OverstockList items={overstockItems} onViewAll={() => {}} />
          </div>
        </>
      ) : (
        <>
          {/* Central/State Admin KPIs */}
          <div className="grid gap-4 md:grid-cols-3">
            <KPICard 
              title="Hospitals with Shortage" 
              value={mockStateKPIData.hospitalsWithShortage} 
              icon={Building2} 
              variant="critical" 
              subtitle="Require immediate attention" 
            />
            <KPICard 
              title="Excess Stock Value" 
              value={`₹${(mockStateKPIData.totalExcessStock / 10000000).toFixed(1)}Cr`} 
              icon={TrendingDown} 
              variant="warning" 
              subtitle="Available for redistribution" 
            />
            <KPICard 
              title="At-Risk Expiry Value" 
              value={`₹${(mockStateKPIData.atRiskExpiryValue / 10000000).toFixed(1)}Cr`} 
              icon={Banknote} 
              variant="warning" 
              subtitle="Stock expiring in 90 days" 
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RegionHeatMap data={mockRegionData} />
            <ActivityFeed items={mockActivityItems} />
          </div>

          <CriticalDrugsTable drugs={mockCriticalDrugs} />
        </>
      )}
    </div>
  );
}