import { Monitor, Users, Cpu, Keyboard, Key, Server } from "lucide-react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AssetStatusChart from "@/components/dashboard/AssetStatusChart";
import LicenseUtilizationChart from "@/components/dashboard/LicenseUtilizationChart";
import ZabbixStatusCard from "@/components/dashboard/ZabbixStatusCard";
import { 
  mockAssets, 
  mockUsers, 
  mockComponents, 
  mockAccessories, 
  mockLicenses, 
  mockZabbixVMs, 
  mockActivityLogs 
} from "@/lib/mockData";

export default function Dashboard() {
  // Calculate asset status counts
  const deployedAssets = mockAssets.filter(asset => asset.status === "deployed").length;
  const availableAssets = mockAssets.filter(asset => asset.status === "available").length;
  const maintenanceAssets = mockAssets.filter(asset => asset.status === "maintenance").length;
  const decommissionedAssets = mockAssets.filter(asset => asset.status === "decommissioned").length;
  
  // Calculate total counts
  const totalAssets = mockAssets.length;
  const totalUsers = mockUsers.length;
  const totalComponents = mockComponents.length;
  const totalAccessories = mockAccessories.length;
  const totalLicenses = mockLicenses.length;
  
  // Calculate expiring licenses (within 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiringLicenses = mockLicenses.filter(license => {
    // Check if expirationDate exists before creating a Date object
    if (!license.expirationDate) {
      return false; 
    }
    const expirationDate = new Date(license.expirationDate);
    return expirationDate > today && expirationDate <= thirtyDaysFromNow;
  }).length;

  return (
    <Layout title="Dashboard | IT Asset Manager">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard 
            title="Total Assets" 
            value={totalAssets} 
            icon={<Monitor className="h-6 w-6 text-blue-600" />} 
          />
          <StatCard 
            title="Total Users" 
            value={totalUsers} 
            icon={<Users className="h-6 w-6 text-indigo-600" />} 
          />
          <StatCard 
            title="Components" 
            value={totalComponents} 
            icon={<Cpu className="h-6 w-6 text-purple-600" />} 
          />
          <StatCard 
            title="Accessories" 
            value={totalAccessories} 
            icon={<Keyboard className="h-6 w-6 text-pink-600" />} 
          />
          <StatCard 
            title="Licenses" 
            value={totalLicenses} 
            icon={<Key className="h-6 w-6 text-yellow-600" />}
            description={expiringLicenses > 0 ? `${expiringLicenses} expiring soon` : undefined}
            trend={expiringLicenses > 0 ? "down" : "neutral"}
          />
          <StatCard 
            title="Zabbix VMs" 
            value={mockZabbixVMs.length} 
            icon={<Server className="h-6 w-6 text-green-600" />}
            description={`${mockZabbixVMs.filter(vm => vm.status === "up").length} online`}
            trend="up"
          />
        </div>
        
        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AssetStatusChart 
            deployed={deployedAssets}
            available={availableAssets}
            maintenance={maintenanceAssets}
            decommissioned={decommissionedAssets}
          />
          <LicenseUtilizationChart licenses={mockLicenses} />
          <ZabbixStatusCard vms={mockZabbixVMs} />
        </div>
        
        {/* Activity Feed */}
        <div className="mt-6">
          <ActivityFeed activities={mockActivityLogs} />
        </div>
      </div>
    </Layout>
  );
}