import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  LayoutDashboard, 
  Home, 
  Monitor, 
  Users, 
  Package, 
  Keyboard, 
  Key, 
  Shield, 
  Server, 
  Network, 
  FileText, 
  Activity as ActivityIcon, 
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  Menu,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  isSidebarCollapsed: boolean;
}

function NavItem({ name, href, icon, isActive, isSidebarCollapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-2 px-3 rounded-md transition-colors",
        isActive 
          ? "bg-gray-100 text-gray-900" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        isSidebarCollapsed ? "justify-center" : ""
      )}
    >
      <span className={cn("flex items-center", isSidebarCollapsed ? "justify-center w-full" : "mr-3")}>
        {icon}
      </span>
      {!isSidebarCollapsed && <span className="text-sm font-medium">{name}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Assets", href: "/assets", icon: <Monitor className="h-5 w-5" /> },
    { name: "Users", href: "/users", icon: <Users className="h-5 w-5" /> },
    { name: "Components", href: "/components", icon: <Package className="h-5 w-5" /> },
    { name: "Accessories", href: "/accessories", icon: <Keyboard className="h-5 w-5" /> },
    { name: "Licenses", href: "/licenses", icon: <Key className="h-5 w-5" /> },
    { name: "BitLocker", href: "/bitlocker", icon: <Shield className="h-5 w-5" /> },
    { name: "Network", href: "/network", icon: <Network className="h-5 w-5" /> },
    { name: "Zabbix VMs", href: "/zabbix", icon: <Server className="h-5 w-5" /> },
    { name: "VM Inventory", href: "/vm-inventory", icon: <Server className="h-5 w-5" /> },
    { name: "Reports", href: "/reports", icon: <FileText className="h-5 w-5" /> },
    { name: "Activity", href: "/activity", icon: <ActivityIcon className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <div className={cn(
      "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      isSidebarCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-c1:28 AM 6/15/2025enter justify-between h-16 px-4 border-b border-gray-200">
        {!isSidebarCollapsed && (
          <Link href="/" className="text-xl font-bold text-gray-900 truncate">
            <div><center>SRPH MIS</center></div>
	    <center>Inventory Manager</center>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="text-gray-500 hover:text-gray-900"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              isActive={isActive(item.href)}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}