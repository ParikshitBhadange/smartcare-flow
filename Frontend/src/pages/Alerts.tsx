import { useState } from 'react';
import { AlertTriangle, Package, Clock, Info, CheckCircle, Eye, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAlerts } from '@/data/mockData';
import { Alert, AlertSeverity, AlertCategory } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';

const severityConfig: Record<AlertSeverity, { icon: typeof AlertTriangle; className: string; badgeClass: string }> = {
  critical: {
    icon: AlertTriangle,
    className: 'text-critical',
    badgeClass: 'bg-critical/10 text-critical border-critical/20',
  },
  high: {
    icon: AlertTriangle,
    className: 'text-warning',
    badgeClass: 'bg-warning/10 text-warning border-warning/20',
  },
  medium: {
    icon: Info,
    className: 'text-info',
    badgeClass: 'bg-info/10 text-info border-info/20',
  },
  info: {
    icon: Info,
    className: 'text-muted-foreground',
    badgeClass: 'bg-muted text-muted-foreground border-muted',
  },
};

const categoryIcons: Record<AlertCategory, typeof AlertTriangle> = {
  shortage: AlertTriangle,
  overstock: Package,
  expiry: Clock,
  system: Info,
};

function AlertCard({ alert }: { alert: Alert }) {
  const severity = severityConfig[alert.severity];
  const SeverityIcon = severity.icon;
  const CategoryIcon = categoryIcons[alert.category];

  return (
    <Card className={`transition-colors ${!alert.isRead ? 'border-l-4 border-l-primary' : ''}`}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 rounded-full p-2 ${severity.className} bg-current/10`}>
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{alert.title}</h3>
                  <Badge variant="outline" className={severity.badgeClass}>
                    {alert.severity}
                  </Badge>
                  {alert.actionTaken && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Resolved
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {alert.drugName && (
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {alert.drugName}
                    </span>
                  )}
                  <span>{alert.hospitalName}</span>
                  <span>
                    {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                {!alert.actionTaken && (
                  <Button size="sm" variant="outline" className="gap-1">
                    Action <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Alerts() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filterAlerts = (category: string) => {
    if (category === 'all') return mockAlerts;
    return mockAlerts.filter((a) => a.category === category);
  };

  const alertCounts = {
    all: mockAlerts.length,
    shortage: mockAlerts.filter((a) => a.category === 'shortage').length,
    overstock: mockAlerts.filter((a) => a.category === 'overstock').length,
    expiry: mockAlerts.filter((a) => a.category === 'expiry').length,
    system: mockAlerts.filter((a) => a.category === 'system').length,
  };

  const unreadCount = mockAlerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''} requiring attention`
              : 'All alerts have been reviewed'}
          </p>
        </div>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-critical/10 p-2">
                <AlertTriangle className="h-5 w-5 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alertCounts.shortage}</p>
                <p className="text-sm text-muted-foreground">Shortage Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-warning/10 p-2">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alertCounts.overstock}</p>
                <p className="text-sm text-muted-foreground">Overstock Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-warning/10 p-2">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alertCounts.expiry}</p>
                <p className="text-sm text-muted-foreground">Expiry Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-info/10 p-2">
                <Info className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alertCounts.system}</p>
                <p className="text-sm text-muted-foreground">System Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({alertCounts.all})</TabsTrigger>
          <TabsTrigger value="shortage">Shortages</TabsTrigger>
          <TabsTrigger value="overstock">Overstock</TabsTrigger>
          <TabsTrigger value="expiry">Expiry</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {['all', 'shortage', 'overstock', 'expiry', 'system'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
            {filterAlerts(tab).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-success" />
                  <h3 className="mt-4 font-semibold">No alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    There are no {tab === 'all' ? '' : tab} alerts at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterAlerts(tab).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
