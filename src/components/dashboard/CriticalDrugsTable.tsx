import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CriticalDrug } from '@/types';
import { ArrowRight } from 'lucide-react';

interface CriticalDrugsTableProps {
  drugs: CriticalDrug[];
  onAction?: (drug: CriticalDrug) => void;
}

export function CriticalDrugsTable({ drugs, onAction }: CriticalDrugsTableProps) {
  const getActionBadge = (action: string) => {
    if (action.toLowerCase().includes('urgent') || action.toLowerCase().includes('emergency')) {
      return 'bg-critical text-critical-foreground';
    }
    if (action.toLowerCase().includes('transfer') || action.toLowerCase().includes('redistribution')) {
      return 'bg-warning text-warning-foreground';
    }
    return 'bg-info text-info-foreground';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Top 10 Critical Drugs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drug Name</TableHead>
              <TableHead className="text-center"># Hospitals Short</TableHead>
              <TableHead className="text-center"># Hospitals Excess</TableHead>
              <TableHead>Action Needed</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugs.map((drug, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{drug.drugName}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="bg-critical/10 text-critical">
                    {drug.hospitalsShort}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {drug.hospitalsExcess}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getActionBadge(drug.actionNeeded)}>
                    {drug.actionNeeded}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAction?.(drug)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
