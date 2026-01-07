import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface OverstockItem {
  drugName: string;
  quantity: number;
  optimalLevel: number;
  excessPercentage: number;
}

interface OverstockListProps {
  items: OverstockItem[];
  onViewAll?: () => void;
}

export function OverstockList({ items, onViewAll }: OverstockListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-warning" />
          Overstocked Items
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
            No overstocked items
          </p>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg border border-warning/20 bg-warning/5"
            >
              <div>
                <p className="font-medium text-foreground">{item.drugName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity.toLocaleString()} units (optimal: {item.optimalLevel.toLocaleString()})
                </p>
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                +{item.excessPercentage}%
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
