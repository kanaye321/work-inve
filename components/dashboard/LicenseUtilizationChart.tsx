
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { License } from "@/types";

interface LicenseUtilizationChartProps {
  licenses: License[];
}

export default function LicenseUtilizationChart({ licenses }: LicenseUtilizationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>License Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {licenses.map((license) => {
            const usedSeats = license.seats - license.seatsAvailable;
            const usedPercentage = Math.round((usedSeats / license.seats) * 100);
            
            return (
              <div key={license.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{license.name}</span>
                  <span className="text-sm font-medium">{usedSeats}/{license.seats} ({usedPercentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      usedPercentage > 90 ? 'bg-red-500' : 
                      usedPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${usedPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
