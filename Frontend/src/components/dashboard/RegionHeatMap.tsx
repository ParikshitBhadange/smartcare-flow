import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RegionData } from '@/types';
import { cn } from '@/lib/utils';

interface RegionHeatMapProps {
  data: RegionData[];
}

export function RegionHeatMap({ data }: RegionHeatMapProps) {
  const getShortageColor = (intensity: number) => {
    if (intensity >= 70) return 'bg-critical';
    if (intensity >= 40) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Regional Shortage Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((region) => (
            <div key={region.region} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{region.region}</span>
                <span className="text-muted-foreground">
                  {region.shortageIntensity}% shortage
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', getShortageColor(region.shortageIntensity))}
                  style={{ width: `${region.shortageIntensity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-critical" />
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
