import { useUser } from '@clerk/clerk-react';
import { useState, useEffect, useMemo } from 'react';
import { Package, IndianRupee, Clock, AlertTriangle, TrendingUp, TrendingDown, Loader2, Calendar, Boxes, ShoppingCart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { DrugBatch } from '@/types';
import { format, differenceInDays } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user } = useUser();
  const [drugBatches, setDrugBatches] = useState<DrugBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch drug batches from API for current user
  useEffect(() => {
    const fetchDrugBatches = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/drug-batches?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch drug batches');
        const data = await response.json();
        setDrugBatches(data.map((b: any) => ({ ...b, id: b._id || b.id })));
      } catch (error) {
        console.error('Error fetching drug batches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrugBatches();
  }, [user?.id]);

  // Calculate all stats from real inventory data
  const stats = useMemo(() => {
    const totalBatches = drugBatches.length;
    const totalQuantity = drugBatches.reduce((sum, b) => sum + b.quantity, 0);
    const totalValue = drugBatches.reduce((sum, b) => sum + (b.totalCost || b.quantity * (b.ratePerUnit || 0)), 0);
    
    const statusCounts = {
      normal: drugBatches.filter(b => b.status === 'normal').length,
      low: drugBatches.filter(b => b.status === 'low').length,
      out_of_stock: drugBatches.filter(b => b.status === 'out_of_stock').length,
      overstock: drugBatches.filter(b => b.status === 'overstock').length,
      near_expiry: drugBatches.filter(b => b.status === 'near_expiry').length,
      expired: drugBatches.filter(b => b.status === 'expired').length,
    };

    const criticalItems = statusCounts.low + statusCounts.out_of_stock + statusCounts.expired;
    const warningItems = statusCounts.near_expiry + statusCounts.overstock;
    const healthyItems = statusCounts.normal;

    // Health score (0-100)
    const healthScore = totalBatches > 0 
      ? Math.round((healthyItems / totalBatches) * 100) 
      : 100;

    // Category-wise distribution with quantity
    const categoryMap = new Map<string, { count: number; value: number; quantity: number }>();
    drugBatches.forEach(b => {
      const existing = categoryMap.get(b.category) || { count: 0, value: 0, quantity: 0 };
      categoryMap.set(b.category, {
        count: existing.count + 1,
        value: existing.value + (b.totalCost || 0),
        quantity: existing.quantity + b.quantity,
      });
    });
    const categoryData = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      fullName: name,
      batches: data.count,
      value: data.value,
      quantity: data.quantity,
    })).sort((a, b) => b.quantity - a.value);

    // Inventory health radial data
    const healthData = [
      { name: 'Health', value: healthScore, fill: healthScore >= 70 ? '#22c55e' : healthScore >= 40 ? '#eab308' : '#ef4444' },
    ];

    // Status distribution for pie chart
    const statusData = [
      { name: 'Normal', value: statusCounts.normal, fill: '#22c55e' },
      { name: 'Low Stock', value: statusCounts.low, fill: '#ef4444' },
      { name: 'Out of Stock', value: statusCounts.out_of_stock, fill: '#dc2626' },
      { name: 'Overstock', value: statusCounts.overstock, fill: '#eab308' },
      { name: 'Near Expiry', value: statusCounts.near_expiry, fill: '#f97316' },
      { name: 'Expired', value: statusCounts.expired, fill: '#7f1d1d' },
    ].filter(s => s.value > 0);

    // Expiry timeline - batches expiring in next 30, 60, 90, 180 days
    const now = new Date();
    const expiryTimeline = drugBatches.reduce((acc, b) => {
      const daysToExpiry = differenceInDays(new Date(b.expiryDate), now);
      if (daysToExpiry < 0) acc.expired++;
      else if (daysToExpiry <= 30) acc.days30++;
      else if (daysToExpiry <= 60) acc.days60++;
      else if (daysToExpiry <= 90) acc.days90++;
      else if (daysToExpiry <= 180) acc.days180++;
      else acc.safe++;
      return acc;
    }, { expired: 0, days30: 0, days60: 0, days90: 0, days180: 0, safe: 0 });

    const expiryChartData = [
      { name: 'Expired', count: expiryTimeline.expired, fill: '#7f1d1d' },
      { name: '< 30 days', count: expiryTimeline.days30, fill: '#ef4444' },
      { name: '30-60 days', count: expiryTimeline.days60, fill: '#f97316' },
      { name: '60-90 days', count: expiryTimeline.days90, fill: '#eab308' },
      { name: '90-180 days', count: expiryTimeline.days180, fill: '#84cc16' },
      { name: '180+ days', count: expiryTimeline.safe, fill: '#22c55e' },
    ].filter(d => d.count > 0);

    // Stock level analysis
    const stockLevelData = drugBatches.map(b => {
      const stockPercent = b.reorderLevel > 0 ? Math.round((b.quantity / b.reorderLevel) * 100) : 100;
      return { ...b, stockPercent };
    }).sort((a, b) => a.stockPercent - b.stockPercent);

    // Items critically low (below 50% of reorder level)
    const criticallyLow = stockLevelData.filter(b => b.stockPercent < 50 && b.quantity > 0).slice(0, 5);

    // Items needing attention (low, out_of_stock, expired, near_expiry)
    const attentionItems = drugBatches
      .filter(b => ['low', 'out_of_stock', 'expired', 'near_expiry'].includes(b.status))
      .sort((a, b) => {
        const priority: Record<string, number> = { expired: 0, out_of_stock: 1, low: 2, near_expiry: 3 };
        return (priority[a.status] || 4) - (priority[b.status] || 4);
      })
      .slice(0, 5);

    // Upcoming expiries (next 90 days)
    const upcomingExpiries = drugBatches
      .filter(b => {
        const days = differenceInDays(new Date(b.expiryDate), now);
        return days >= 0 && days <= 90;
      })
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
      .slice(0, 5);

    // Top valuable items
    const topByValue = [...drugBatches]
      .sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0))
      .slice(0, 5);

    // Recently updated (based on lastUpdated)
    const recentlyUpdated = [...drugBatches]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5);

    return {
      totalBatches,
      totalQuantity,
      totalValue,
      statusCounts,
      criticalItems,
      warningItems,
      healthyItems,
      healthScore,
      healthData,
      categoryData,
      statusData,
      expiryChartData,
      criticallyLow,
      attentionItems,
      upcomingExpiries,
      topByValue,
      recentlyUpdated,
    };
  }, [drugBatches]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      normal: { label: 'Normal', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
      low: { label: 'Low', className: 'bg-red-500/10 text-red-600 border-red-500/20' },
      out_of_stock: { label: 'Out', className: 'bg-red-600/10 text-red-700 border-red-600/20' },
      overstock: { label: 'Excess', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
      near_expiry: { label: 'Expiring', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
      expired: { label: 'Expired', className: 'bg-red-800/10 text-red-800 border-red-800/20' },
    };
    const { label, className } = config[status] || { label: status, className: '' };
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getDaysToExpiry = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return <span className="text-red-600 font-medium">Expired</span>;
    if (days === 0) return <span className="text-red-600 font-medium">Today!</span>;
    if (days <= 7) return <span className="text-red-500 font-medium">{days}d left</span>;
    if (days <= 30) return <span className="text-orange-500 font-medium">{days}d left</span>;
    return <span className="text-yellow-600">{days}d left</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time inventory analytics • {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
        </div>
      ) : drugBatches.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Inventory Data</h2>
          <p className="text-muted-foreground mb-4">
            Start by adding drug batches to your inventory to see dashboard analytics.
          </p>
        </Card>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory</CardTitle>
                <Boxes className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.totalBatches}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{stats.totalQuantity.toLocaleString()}</span> total units
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                <IndianRupee className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹{stats.totalValue.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Avg <span className="font-medium">₹{stats.totalBatches > 0 ? Math.round(stats.totalValue / stats.totalBatches).toLocaleString() : 0}</span>/batch
                </p>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-br ${stats.criticalItems > 0 ? 'from-red-500/10 to-red-600/5 border-red-500/20' : 'from-gray-500/10 to-gray-600/5'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
                <AlertTriangle className={`h-5 w-5 ${stats.criticalItems > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stats.criticalItems > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {stats.criticalItems}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.statusCounts.expired > 0 && <span className="text-red-600">{stats.statusCounts.expired} expired • </span>}
                  {stats.statusCounts.out_of_stock} out • {stats.statusCounts.low} low
                </p>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-br ${stats.warningItems > 0 ? 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20' : 'from-gray-500/10 to-gray-600/5'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
                <Clock className={`h-5 w-5 ${stats.warningItems > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stats.warningItems > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                  {stats.warningItems}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.statusCounts.near_expiry} expiring soon • {stats.statusCounts.overstock} overstock
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Health Score + Status Distribution */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Inventory Health Score - Radial Gauge */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Inventory Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="60%" 
                      outerRadius="90%" 
                      data={stats.healthData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        background={{ fill: 'hsl(var(--muted))' }}
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center -mt-16">
                  <div className={`text-4xl font-bold ${stats.healthScore >= 70 ? 'text-green-600' : stats.healthScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {stats.healthScore}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.healthScore >= 70 ? 'Healthy' : stats.healthScore >= 40 ? 'Needs Attention' : 'Critical'}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6 text-center text-xs">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <div className="font-bold text-green-600">{stats.healthyItems}</div>
                    <div className="text-muted-foreground">Healthy</div>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <div className="font-bold text-yellow-600">{stats.warningItems}</div>
                    <div className="text-muted-foreground">Warning</div>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <div className="font-bold text-red-600">{stats.criticalItems}</div>
                    <div className="text-muted-foreground">Critical</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution Pie */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Batch Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  {stats.statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stats.statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value} batches`, '']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        />
                        <Legend 
                          layout="vertical" 
                          align="right" 
                          verticalAlign="middle"
                          formatter={(value, entry: any) => (
                            <span className="text-sm">
                              {value}: <span className="font-medium">{entry.payload.value}</span>
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Distribution + Expiry Timeline */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category Distribution - Area Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  Stock Quantity by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  {stats.categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.categoryData} margin={{ left: -10, right: 10 }}>
                        <defs>
                          <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip 
                          formatter={(value: number, name: string) => [value.toLocaleString() + ' units', 'Quantity']}
                          labelFormatter={(label) => stats.categoryData.find(c => c.name === label)?.fullName || label}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        />
                        <Bar dataKey="quantity" fill="url(#colorQty)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No category data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expiry Timeline */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Expiry Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  {stats.expiryChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.expiryChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip 
                          formatter={(value: number) => [`${value} batches`, 'Count']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {stats.expiryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No expiry data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Items Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Items Needing Attention */}
            <Card className={stats.attentionItems.length > 0 ? 'border-orange-500/30' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${stats.attentionItems.length > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                  Items Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.attentionItems.length > 0 ? stats.attentionItems.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{batch.drugName}</p>
                        <p className="text-xs text-muted-foreground">
                          {batch.quantity.toLocaleString()} {batch.unit} • Reorder: {batch.reorderLevel}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        {getStatusBadge(batch.status)}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 bg-green-500/5 rounded-lg border border-green-500/20">
                      <div className="text-3xl mb-2">✓</div>
                      <p className="text-green-600 font-medium">All items are healthy</p>
                      <p className="text-muted-foreground text-sm">No immediate action required</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Expiries */}
            <Card className={stats.upcomingExpiries.length > 0 ? 'border-yellow-500/30' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${stats.upcomingExpiries.length > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  Upcoming Expiries (90 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.upcomingExpiries.length > 0 ? stats.upcomingExpiries.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{batch.drugName}</p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {format(new Date(batch.expiryDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0 text-right">
                        {getDaysToExpiry(batch.expiryDate)}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 bg-green-500/5 rounded-lg border border-green-500/20">
                      <div className="text-3xl mb-2">📦</div>
                      <p className="text-green-600 font-medium">No items expiring soon</p>
                      <p className="text-muted-foreground text-sm">All batches have 90+ days validity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row: Top Value + Recent Updates */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Items by Value */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Highest Value Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topByValue.length > 0 ? stats.topByValue.map((batch, idx) => (
                    <div key={batch.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-yellow-500/20 text-yellow-600' : 
                        idx === 1 ? 'bg-gray-400/20 text-gray-600' :
                        idx === 2 ? 'bg-orange-500/20 text-orange-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{batch.drugName}</p>
                        <p className="text-xs text-muted-foreground">
                          {batch.quantity.toLocaleString()} {batch.unit} @ ₹{(batch.ratePerUnit || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-green-600">₹{(batch.totalCost || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No items to display</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recently Updated */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Recently Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentlyUpdated.length > 0 ? stats.recentlyUpdated.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{batch.drugName}</p>
                        <p className="text-xs text-muted-foreground">
                          {batch.quantity.toLocaleString()} {batch.unit}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0 text-right">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(batch.lastUpdated), 'MMM d, h:mm a')}
                        </p>
                        {getStatusBadge(batch.status)}
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No recent updates</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}