
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetStatusChartProps {
  deployed: number;
  available: number;
  maintenance: number;
  decommissioned: number;
}

export default function AssetStatusChart({ deployed, available, maintenance, decommissioned }: AssetStatusChartProps) {
  const total = deployed + available + maintenance + decommissioned;
  
  const calculatePercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Deployed</span>
            <span className="text-sm font-medium">{deployed} ({calculatePercentage(deployed)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${calculatePercentage(deployed)}%` }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Available</span>
            <span className="text-sm font-medium">{available} ({calculatePercentage(available)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${calculatePercentage(available)}%` }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Maintenance</span>
            <span className="text-sm font-medium">{maintenance} ({calculatePercentage(maintenance)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${calculatePercentage(maintenance)}%` }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Decommissioned</span>
            <span className="text-sm font-medium">{decommissioned} ({calculatePercentage(decommissioned)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: `${calculatePercentage(decommissioned)}%` }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
