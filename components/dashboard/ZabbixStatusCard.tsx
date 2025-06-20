
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZabbixVM } from "@/types";

interface ZabbixStatusCardProps {
  vms: ZabbixVM[];
}

export default function ZabbixStatusCard({ vms }: ZabbixStatusCardProps) {
  const upCount = vms.filter(vm => vm.status === "up").length;
  const downCount = vms.filter(vm => vm.status === "down").length;
  const unknownCount = vms.filter(vm => vm.status === "unknown").length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zabbix VM Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700">{upCount}</p>
            <p className="text-sm text-green-700">Up</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-700">{downCount}</p>
            <p className="text-sm text-red-700">Down</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-700">{unknownCount}</p>
            <p className="text-sm text-gray-700">Unknown</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {vms.map(vm => (
            <div key={vm.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{vm.name}</p>
                <p className="text-sm text-gray-500">{vm.ipAddress}</p>
              </div>
              <div className="flex items-center">
                <span 
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    vm.status === "up" ? "bg-green-500" : 
                    vm.status === "down" ? "bg-red-500" : "bg-gray-500"
                  }`}
                ></span>
                <span 
                  className={`text-sm font-medium ${
                    vm.status === "up" ? "text-green-700" : 
                    vm.status === "down" ? "text-red-700" : "text-gray-700"
                  }`}
                >
                  {vm.status.charAt(0).toUpperCase() + vm.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
