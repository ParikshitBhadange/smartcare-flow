import { useState } from 'react';
import { Calendar, TrendingDown, TrendingUp, AlertTriangle, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { mockRegionData } from '@/data/mockData';

const shortageData = [
  { month: 'Aug', incidents: 45 },
  { month: 'Sep', incidents: 52 },
  { month: 'Oct', incidents: 38 },
  { month: 'Nov', incidents: 65 },
  { month: 'Dec', incidents: 72 },
  { month: 'Jan', incidents: 58 },
];

const wastageData = [
  { month: 'Aug', value: 125000 },
  { month: 'Sep', value: 98000 },
  { month: 'Oct', value: 142000 },
  { month: 'Nov', value: 87000 },
  { month: 'Dec', value: 165000 },
  { month: 'Jan', value: 112000 },
];

const highRiskHospitals = [
  { name: 'Community Health Clinic', stockoutDays: 12, wastage: 8.5, adherence: 72 },
  { name: 'Rural Medical Center', stockoutDays: 9, wastage: 12.3, adherence: 65 },
  { name: 'District Hospital East', stockoutDays: 7, wastage: 5.2, adherence: 78 },
  { name: 'Suburban Care Facility', stockoutDays: 6, wastage: 9.1, adherence: 71 },
  { name: 'Central Trauma Center', stockoutDays: 4, wastage: 3.8, adherence: 85 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('6m');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-sm text-muted-foreground">
            Regional analysis and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Region Heat Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Regional Stock Status
          </CardTitle>
          <CardDescription>
            Shortage and excess stock intensity by region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {mockRegionData.map((region) => (
              <Card key={region.region} className="overflow-hidden">
                <div
                  className="h-2"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(0 72% ${100 - region.shortageIntensity * 0.5}%) 0%, 
                      hsl(38 92% ${100 - region.excessIntensity * 0.4}%) 100%)`,
                  }}
                />
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-sm">{region.region}</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shortage</span>
                      <Badge
                        variant="outline"
                        className={
                          region.shortageIntensity > 60
                            ? 'bg-critical/10 text-critical border-critical/20'
                            : region.shortageIntensity > 30
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : 'bg-success/10 text-success border-success/20'
                        }
                      >
                        {region.shortageIntensity}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Excess</span>
                      <Badge
                        variant="outline"
                        className={
                          region.excessIntensity > 50
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {region.excessIntensity}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shortage Incidents Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-critical" />
              Shortage Incidents Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={shortageData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="hsl(var(--critical))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--critical))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wastage Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              Expired Stock Wastage (₹)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wastageData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Wastage']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High-Risk Hospitals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            High-Risk Hospitals
          </CardTitle>
          <CardDescription>
            Hospitals with the highest stock management risk scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead className="text-right">Avg Stockout Days</TableHead>
                <TableHead className="text-right">Wastage %</TableHead>
                <TableHead className="text-right">Adherence Score</TableHead>
                <TableHead className="text-right">Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highRiskHospitals.map((hospital) => {
                const riskLevel =
                  hospital.stockoutDays > 8 || hospital.wastage > 10 || hospital.adherence < 70
                    ? 'High'
                    : hospital.stockoutDays > 5 || hospital.wastage > 6 || hospital.adherence < 80
                    ? 'Medium'
                    : 'Low';
                return (
                  <TableRow key={hospital.name}>
                    <TableCell className="font-medium">{hospital.name}</TableCell>
                    <TableCell className="text-right">{hospital.stockoutDays} days</TableCell>
                    <TableCell className="text-right">{hospital.wastage}%</TableCell>
                    <TableCell className="text-right">{hospital.adherence}%</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          riskLevel === 'High'
                            ? 'bg-critical/10 text-critical border-critical/20'
                            : riskLevel === 'Medium'
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : 'bg-success/10 text-success border-success/20'
                        }
                      >
                        {riskLevel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
