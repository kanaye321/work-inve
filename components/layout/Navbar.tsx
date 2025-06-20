
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, ChevronDown, LayoutDashboard, Monitor, Users, Cpu, Keyboard, Key, Shield, Network, Server, FileText, Settings, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Assets", href: "/assets", icon: <Monitor className="h-5 w-5" /> },
    { name: "Users", href: "/users", icon: <Users className="h-5 w-5" /> },
    { name: "Components", href: "/components", icon: <Cpu className="h-5 w-5" /> },
    { name: "Accessories", href: "/accessories", icon: <Keyboard className="h-5 w-5" /> },
    { name: "Licenses", href: "/licenses", icon: <Key className="h-5 w-5" /> },
    { name: "BitLocker", href: "/bitlocker", icon: <Shield className="h-5 w-5" /> },
    { name: "Network", href: "/network", icon: <Network className="h-5 w-5" /> },
    { name: "Zabbix VMs", href: "/zabbix", icon: <Server className="h-5 w-5" /> },
    { name: "Reports", href: "/reports", icon: <FileText className="h-5 w-5" /> },
    { name: "Activity", href: "/activity", icon: <Activity className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                IT Asset Manager
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-600">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item.href)
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
