import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Package, Bell, Check, Clock, AlertCircle } from 'lucide-react';
import { ActivityItem } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'transfer':
        return ArrowLeftRight;
      case 'delivery':
        return Package;
      case 'alert':
        return Bell;
      default:
        return Bell;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'approved':
        return 'text-info bg-info/10';
      case 'in_transit':
        return 'text-warning bg-warning/10';
      case 'critical':
        return 'text-critical bg-critical/10';
      case 'pending':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={cn('rounded-full p-2', getStatusColor(item.status))}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {item.status && (
                  <Badge variant="secondary" className={cn('text-xs', getStatusColor(item.status))}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
