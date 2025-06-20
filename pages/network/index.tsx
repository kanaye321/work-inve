import { useState } from "react";
import { Search, Scan, Server, Download, Laptop, Cpu, Usb, HardDrive, Wifi, Network, Globe, Router, Save } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockAssets } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label"; // Added Label import

interface DeviceDetails {
  ipAddress: string;
  hostname: string;
  macAddress: string;
  serialNumber: string;
  model: string;
  os: string; // Added missing os property
  status: string;
  lastSeen: string;
  usbDevices: UsbDevice[];
  networkInterfaces: NetworkInterface[];
  hardwareDetails: HardwareDetails;
  manufacturer: string; // Added manufacturer
  location: string; // Added location
  assignedTo: string; // Added assignedTo
}

interface UsbDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

interface NetworkInterface {
  name: string;
  macAddress: string;
  ipAddress: string;
  status: "up" | "down";
}

interface HardwareDetails {
  cpu: string;
  memory: string;
  storage: string;
}

export default function NetworkPage() {
  const { toast } = useToast();
  const [ipAddress, setIpAddress] = useState("");
  const [dns1, setDns1] = useState<string>('107.105.134.9');
  const [dns2, setDns2] = useState<string>('107.105.134.8');
  const [isScanning, setIsScanning] = useState(false);
  const [isUpdatingDns, setIsUpdatingDns] = useState(false);
  const [scanResults, setScanResults] = useState<DeviceDetails | null>(null);
  const [recentScans, setRecentScans] = useState<string[]>([]);

  const handleScan = () => {
    if (!ipAddress) {
      toast({
        title: "IP Address Required",
        description: "Please enter an IP address to scan.",
        variant: "destructive",
      });
      return;
    }

    // Validate IP address format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress)) {
      toast({
        title: "Invalid IP Address",
        description: "Please enter a valid IP address (e.g., 192.168.1.100).",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    // Simulate network scan with a delay
    setTimeout(() => {
      // Check if the IP matches any of our mock assets
      const matchedAsset = mockAssets.find(asset => asset.ipAddress === ipAddress);
      
      if (matchedAsset) {
        // Generate mock device details based on the asset
        const deviceDetails: DeviceDetails = {
          ipAddress: matchedAsset.ipAddress || ipAddress,
          hostname: matchedAsset.assetTag || "Unknown", // Use assetTag instead of name
          macAddress: matchedAsset.macAddress || generateRandomMac(),
          serialNumber: matchedAsset.serialNumber || "Unknown",
          model: matchedAsset.model || "Unknown",
          manufacturer: matchedAsset.manufacturer || "Unknown", // Added manufacturer
          os: "Unknown OS", // Added missing os property
          status: matchedAsset.status || "unknown",
          location: matchedAsset.location || "Unknown", // Added location
          assignedTo: matchedAsset.assignedTo ? String(matchedAsset.assignedTo) : "Unassigned", // Convert ID to string if needed and handle potential undefined user lookup
          lastSeen: matchedAsset.updatedAt ? new Date(matchedAsset.updatedAt).toLocaleString() : "Never",
          usbDevices: generateMockUsbDevices(),
          networkInterfaces: [
            {
              name: "eth0",
              macAddress: matchedAsset.macAddress || generateRandomMac(),
              ipAddress: matchedAsset.ipAddress || ipAddress,
              status: "up"
            },
            {
              name: "wlan0",
              macAddress: generateRandomMac(),
              ipAddress: "",
              status: "down"
            }
          ],
          hardwareDetails: {
            cpu: "Intel Core i7-10700K @ 3.80GHz",
            memory: "16GB DDR4",
            storage: "512GB SSD",
          }
        };
        
        setScanResults(deviceDetails);
        
        // Add to recent scans if not already there
        if (!recentScans.includes(ipAddress)) {
          setRecentScans(prev => [ipAddress, ...prev].slice(0, 5));
        }
        
        toast({
          title: "Scan Complete",
          description: `Device found at ${ipAddress}`,
        });
      } else {
        // Generate random device details for demonstration
        const deviceDetails: DeviceDetails = {
          ipAddress: ipAddress,
          hostname: `host-${ipAddress.split('.').pop()}`,
          macAddress: generateRandomMac(),
          serialNumber: `SN${Math.floor(Math.random() * 1000000)}`,
          model: "Generic Device",
          manufacturer: "Unknown Manufacturer", // Added manufacturer
          os: "Unknown OS", // Added missing os property
          status: Math.random() > 0.3 ? "Online" : "Offline",
          location: "Unknown", // Added location
          assignedTo: "Unassigned", // Added assignedTo
          lastSeen: "Never", // Added lastSeen
          usbDevices: generateMockUsbDevices(),
          networkInterfaces: [
            {
              name: "eth0",
              macAddress: generateRandomMac(),
              ipAddress: ipAddress,
              status: "up"
            }
          ],
          hardwareDetails: {
            cpu: "Unknown CPU",
            memory: "Unknown Memory",
            storage: "Unknown Storage",
          }
        };
        
        setScanResults(deviceDetails);
        
        // Add to recent scans if not already there
        if (!recentScans.includes(ipAddress)) {
          setRecentScans(prev => [ipAddress, ...prev].slice(0, 5));
        }
        
        toast({
          title: "Scan Complete",
          description: `Device found at ${ipAddress}`,
        });
      }
      
      setIsScanning(false);
    }, 2000);
  };

  const handleRecentScanClick = (ip: string) => {
    setIpAddress(ip);
    // Automatically trigger scan
    setTimeout(() => {
      document.getElementById("scan-button")?.click();
    }, 100);
  };

  const handleUpdateDns = () => {
    setIsUpdatingDns(true);
    
    // Simulate API call to update DNS settings
    setTimeout(() => {
      setIsUpdatingDns(false);
      toast({
        title: 'DNS Settings Updated',
        description: 'DNS server settings have been updated successfully.',
      });
    }, 1000);
  };

  // Helper function to generate random MAC address
  const generateRandomMac = () => {
    return Array.from({ length: 6 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(':');
  };

  // Helper function to generate mock USB devices
  const generateMockUsbDevices = (): UsbDevice[] => {
    const devices: UsbDevice[] = [];
    const numDevices = Math.floor(Math.random() * 5) + 1;
    
    const deviceTypes = [
      { name: "Kingston USB Drive", type: "Storage" },
      { name: "Logitech Mouse", type: "HID" },
      { name: "Microsoft Keyboard", type: "HID" },
      { name: "Webcam C920", type: "Video" },
      { name: "USB Headset", type: "Audio" },
      { name: "External HDD", type: "Storage" },
      { name: "USB Printer", type: "Printer" },
      { name: "USB Network Adapter", type: "Network" }
    ];
    
    for (let i = 0; i < numDevices; i++) {
      const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      devices.push({
        id: `usb-${i}-${Date.now()}`,
        name: deviceType.name,
        type: deviceType.type,
        connected: Math.random() > 0.2
      });
    }
    
    return devices;
  };

  return (
    <Layout title="Network Management | IT Asset Manager">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Network Scanner</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>IP Address Scanner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Enter IP address (e.g., 192.168.1.100)"
                  className="pl-8"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                />
              </div>
              <Button 
                id="scan-button"
                onClick={handleScan} 
                disabled={isScanning}
              >
                <Scan className="h-4 w-4 mr-2" />
                {isScanning ? "Scanning..." : "Scan IP"}
              </Button>
            </div>
            
            {recentScans.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Recent Scans:</h3>
                <div className="flex flex-wrap gap-2">
                  {recentScans.map((ip, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRecentScanClick(ip)}
                    >
                      {ip}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {isScanning ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : scanResults ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="bg-gray-100 p-4 rounded-lg flex-1 min-w-[250px]">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Device Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">IP Address:</span>
                        <span className="font-mono">{scanResults.ipAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hostname:</span>
                        <span>{scanResults.hostname}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">MAC Address:</span>
                        <span className="font-mono">{scanResults.macAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Serial Number:</span>
                        <span>{scanResults.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Model:</span>
                        <span>{scanResults.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Manufacturer:</span>
                        <span>{scanResults.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={scanResults.status === "Online" ? "text-green-600" : "text-red-600"}>
                          {scanResults.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span>{scanResults.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Assigned To:</span>
                        <span>{scanResults.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Seen:</span>
                        <span>{scanResults.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-lg flex-1 min-w-[250px]">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Cpu className="h-4 w-4 mr-2" />
                      Hardware Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">CPU:</span>
                        <span>{scanResults.hardwareDetails.cpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Memory:</span>
                        <span>{scanResults.hardwareDetails.memory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Storage:</span>
                        <span>{scanResults.hardwareDetails.storage}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="network">
                  <TabsList>
                    <TabsTrigger value="network">Network Interfaces</TabsTrigger>
                    <TabsTrigger value="usb">USB Devices</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="network" className="mt-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Wifi className="h-4 w-4 mr-2" />
                        Network Interfaces
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Interface</th>
                              <th className="px-4 py-2 text-left">MAC Address</th>
                              <th className="px-4 py-2 text-left">IP Address</th>
                              <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scanResults.networkInterfaces.map((iface, index) => (
                              <tr key={index} className="border-b">
                                <td className="px-4 py-2">{iface.name}</td>
                                <td className="px-4 py-2 font-mono">{iface.macAddress}</td>
                                <td className="px-4 py-2 font-mono">{iface.ipAddress || "N/A"}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    iface.status === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}>
                                    {iface.status === "up" ? "Up" : "Down"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="usb" className="mt-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Usb className="h-4 w-4 mr-2" />
                        USB Devices
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Device Name</th>
                              <th className="px-4 py-2 text-left">Type</th>
                              <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scanResults.usbDevices.map((device, index) => (
                              <tr key={index} className="border-b">
                                <td className="px-4 py-2">{device.name}</td>
                                <td className="px-4 py-2">{device.type}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    device.connected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                  }`}>
                                    {device.connected ? "Connected" : "Disconnected"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {scanResults.usbDevices.length === 0 && (
                              <tr>
                                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                                  No USB devices detected
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Add DNS Settings Card */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>DNS Settings</CardTitle>
            <CardDescription>Configure DNS server settings for better connectivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='dns1'>Primary DNS Server</Label>
                <Input 
                  id='dns1' 
                  value={dns1} 
                  onChange={(e) => setDns1(e.target.value)} 
                  placeholder='e.g. 8.8.8.8'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dns2'>Secondary DNS Server</Label>
                <Input 
                  id='dns2' 
                  value={dns2} 
                  onChange={(e) => setDns2(e.target.value)} 
                  placeholder='e.g. 8.8.4.4'
                />
              </div>
            </div>
            <div className='mt-4'>
              <Button onClick={handleUpdateDns} disabled={isUpdatingDns}>
                {isUpdatingDns ? (
                  <>
                    <Cpu className='h-4 w-4 mr-2 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className='h-4 w-4 mr-2' />
                    Save DNS Settings
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}