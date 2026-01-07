import { Package, DollarSign, Clock, AlertTriangle, Building2, TrendingDown, Banknote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/dashboard/KPICard';
import { ConsumptionChart } from '@/components/dashboard/ConsumptionChart';
import { ShortageList } from '@/components/dashboard/ShortageList';
import { OverstockList } from '@/components/dashboard/OverstockList';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { RegionHeatMap } from '@/components/dashboard/RegionHeatMap';
import { CriticalDrugsTable } from '@/components/dashboard/CriticalDrugsTable';
import {
  mockKPIData,
  mockStateKPIData,
  mockConsumptionData,
  mockActivityItems,
  mockRegionData,
  mockCriticalDrugs,
} from '@/data/mockData';

export default function Dashboard() {
  const { user } = useAuth();
  const isHospitalAdmin = user?.role === 'hospital_admin';

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
            <KPICard title="Total SKUs" value={mockKPIData.totalSKUs} icon={Package} trend={{ value: 5.2, isPositive: true }} />
            <KPICard title="Stock Value" value={`₹${(mockKPIData.totalStockValue / 100000).toFixed(1)}L`} icon={DollarSign} subtitle="Current inventory value" />
            <KPICard title="Near Expiry" value={mockKPIData.imminentExpiryBatches} icon={Clock} variant="warning" subtitle="Batches expiring in 90 days" />
            <KPICard title="Active Shortages" value={mockKPIData.activeShortageItems} icon={AlertTriangle} variant="critical" trend={{ value: 8.3, isPositive: false }} />
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
            <KPICard title="Hospitals with Shortage" value={mockStateKPIData.hospitalsWithShortage} icon={Building2} variant="critical" subtitle="Require immediate attention" />
            <KPICard title="Excess Stock Value" value={`₹${(mockStateKPIData.totalExcessStock / 10000000).toFixed(1)}Cr`} icon={TrendingDown} variant="warning" subtitle="Available for redistribution" />
            <KPICard title="At-Risk Expiry Value" value={`₹${(mockStateKPIData.atRiskExpiryValue / 10000000).toFixed(1)}Cr`} icon={Banknote} variant="warning" subtitle="Stock expiring in 90 days" />
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
