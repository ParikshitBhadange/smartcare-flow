import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { DrugBatch } from '@/types';
import { cn } from '@/lib/utils';

interface ShortageItem {
  drugName: string;
  quantity: number;
  reorderLevel: number;
  severity: 'critical' | 'high' | 'medium';
}

interface ShortageListProps {
  items: ShortageItem[];
  onViewAll?: () => void;
}

export function ShortageList({ items, onViewAll }: ShortageListProps) {
  const severityStyles = {
    critical: 'bg-critical/10 text-critical border-critical/20',
    high: 'bg-warning/10 text-warning border-warning/20',
    medium: 'bg-info/10 text-info border-info/20',
  };

  const badgeStyles = {
    critical: 'bg-critical text-critical-foreground',
    high: 'bg-warning text-warning-foreground',
    medium: 'bg-info text-info-foreground',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-critical" />
          Critical Shortages
        </CardTitle>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="text-primary">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No critical shortages at this time
          </p>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border',
                severityStyles[item.severity]
              )}
            >
              <div>
                <p className="font-medium text-foreground">{item.drugName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} / {item.reorderLevel} units
                </p>
              </div>
              <Badge className={badgeStyles[item.severity]}>{item.severity}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
