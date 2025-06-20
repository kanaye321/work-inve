import { useState, useEffect, useCallback } from "react";
import { Server, AlertTriangle, CheckCircle, RefreshCw, Key, Settings } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mockZabbixVMs } from "@/lib/mockData";
import { ZabbixVM } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function ZabbixPage() {
  const { toast } = useToast();
  const [vms, setVMs] = useState<ZabbixVM[]>(mockZabbixVMs);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [serverUrl, setServerUrl] = useState('https://zabbix.example.com/api_jsonrpc.php');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>(new Date().toLocaleString());

  // Simulate connection to Zabbix server
  const connectToZabbix = () => {
    if (!serverUrl || !apiToken) {
      toast({
        title: 'Connection Failed',
        description: 'Please provide both server URL and API token',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: 'Connection Successful',
        description: 'Successfully connected to Zabbix server',
      });
      refreshData();
    }, 1500);
  };

  // Simulate refreshing data from Zabbix
  const refreshData = useCallback(() => {
    setLastRefresh(new Date().toLocaleString());
    
    // In a real implementation, this would fetch data from the Zabbix API
    // For now, we'll just update the status of some VMs randomly
    const updatedVMs = vms.map(vm => {
      // Randomly update some VMs (for demo purposes)
      if (Math.random() > 0.7) {
        const statuses: ('up' | 'down' | 'unknown')[] = ['up', 'down', 'unknown'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
          ...vm,
          status: randomStatus,
          cpuUsage: randomStatus === 'up' ? Math.floor(Math.random() * 100) : 0,
          memoryUsage: randomStatus === 'up' ? Math.floor(Math.random() * 100) : 0,
          lastCheck: new Date().toISOString()
        };
      }
      return vm;
    });
    
    setVMs(updatedVMs);
  }, [vms]);

  // Set up auto-refresh
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected && autoRefresh) {
      interval = setInterval(() => {
        refreshData();
      }, 60000); // Refresh every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, autoRefresh, refreshData]);

  // Handle additional settings button click
  const handleAdditionalSettings = () => {
    toast({
      title: 'Additional Settings',
      description: 'Opening advanced Zabbix configuration options',
    });
    // In a real app, this might open a modal or navigate to a settings page
  };

  // Handle generate API token button click
  const handleGenerateToken = () => {
    const newToken = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
    setApiToken(newToken);
    toast({
      title: 'API Token Generated',
      description: 'A new API token has been generated',
    });
  };

  return (
    <Layout title='Zabbix Monitoring | IT Asset Manager'>
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <h1 className='text-2xl font-bold tracking-tight'>Zabbix Monitoring</h1>
          {isConnected ? (
            <div className='flex items-center gap-2'>
              <span className='flex items-center text-sm text-green-600'>
                <CheckCircle className='h-4 w-4 mr-1' />
                Connected
              </span>
              <Button 
                variant='outline' 
                size='sm'
                onClick={refreshData}
              >
                <RefreshCw className='h-4 w-4 mr-2' />
                Refresh
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connectToZabbix}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                  Connecting...
                </>
              ) : (
                <>
                  <Server className='h-4 w-4 mr-2' />
                  Connect to Zabbix
                </>
              )}
            </Button>
          )}
        </div>
        
        <Tabs defaultValue='dashboard'>
          <TabsList>
            <TabsTrigger value='dashboard'>Dashboard</TabsTrigger>
            <TabsTrigger value='hosts'>Hosts</TabsTrigger>
            <TabsTrigger value='configuration'>Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value='dashboard' className='space-y-4 mt-4'>
            {!isConnected ? (
              <Alert>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  Please connect to your Zabbix server to view monitoring data.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-lg'>Hosts Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='grid grid-cols-3 gap-2 text-center'>
                        <div className='bg-green-100 p-3 rounded-lg'>
                          <p className='text-2xl font-bold text-green-700'>
                            {vms.filter(vm => vm.status === "up").length}
                          </p>
                          <p className='text-xs text-green-700'>Up</p>
                        </div>
                        <div className='bg-red-100 p-3 rounded-lg'>
                          <p className='text-2xl font-bold text-red-700'>
                            {vms.filter(vm => vm.status === "down").length}
                          </p>
                          <p className='text-xs text-red-700'>Down</p>
                        </div>
                        <div className='bg-gray-100 p-3 rounded-lg'>
                          <p className='text-2xl font-bold text-gray-700'>
                            {vms.filter(vm => vm.status === "unknown").length}
                          </p>
                          <p className='text-xs text-gray-700'>Unknown</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-lg'>Resource Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2'>
                        <div>
                          <div className='flex justify-between text-sm mb-1'>
                            <span>CPU</span>
                            <span>{Math.round(vms.reduce((acc, vm) => acc + vm.cpuUsage, 0) / vms.length)}%</span>
                          </div>
                          <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div 
                              className='bg-blue-600 h-2 rounded-full' 
                              style={{ width: `${Math.round(vms.reduce((acc, vm) => acc + vm.cpuUsage, 0) / vms.length)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className='flex justify-between text-sm mb-1'>
                            <span>Memory</span>
                            <span>{Math.round(vms.reduce((acc, vm) => acc + vm.memoryUsage, 0) / vms.length)}%</span>
                          </div>
                          <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div 
                              className='bg-purple-600 h-2 rounded-full' 
                              style={{ width: `${Math.round(vms.reduce((acc, vm) => acc + vm.memoryUsage, 0) / vms.length)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className='flex justify-between text-sm mb-1'>
                            <span>Disk</span>
                            <span>{Math.round(vms.reduce((acc, vm) => acc + vm.diskUsage, 0) / vms.length)}%</span>
                          </div>
                          <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div 
                              className='bg-yellow-600 h-2 rounded-full' 
                              style={{ width: `${Math.round(vms.reduce((acc, vm) => acc + vm.diskUsage, 0) / vms.length)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-lg'>Connection Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-gray-500'>Server:</span>
                          <span className='font-medium truncate max-w-[180px]'>{serverUrl.replace(/^https?:\/\//, "").split("/")[0]}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-500'>API Token:</span>
                          <span className='font-medium'>••••••••••••</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-500'>Last Refresh:</span>
                          <span className='font-medium'>{lastRefresh}</span>
                        </div>
                        <div className='flex justify-between items-center pt-2'>
                          <span className='text-gray-500'>Auto Refresh:</span>
                          <Switch 
                            checked={autoRefresh} 
                            onCheckedChange={setAutoRefresh} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monitored Hosts</CardTitle>
                    <CardDescription>
                      Showing {vms.length} hosts from Zabbix
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='overflow-x-auto'>
                      <table className='w-full text-sm text-left'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                          <tr>
                            <th className='px-4 py-3'>Host Name</th>
                            <th className='px-4 py-3'>IP Address</th>
                            <th className='px-4 py-3'>Status</th>
                            <th className='px-4 py-3'>CPU</th>
                            <th className='px-4 py-3'>Memory</th>
                            <th className='px-4 py-3'>Disk</th>
                            <th className='px-4 py-3'>Uptime</th>
                            <th className='px-4 py-3'>OS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vms.map((vm) => (
                            <tr key={vm.id} className='border-b hover:bg-gray-50'>
                              <td className='px-4 py-3 font-medium'>{vm.name}</td>
                              <td className='px-4 py-3'>{vm.ipAddress}</td>
                              <td className='px-4 py-3'>
                                <span 
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    vm.status === "up" ? "bg-green-100 text-green-800" : 
                                    vm.status === "down" ? "bg-red-100 text-red-800" : 
                                    "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {vm.status.charAt(0).toUpperCase() + vm.status.slice(1)}
                                </span>
                              </td>
                              <td className='px-4 py-3'>
                                <div className='flex items-center'>
                                  <div className='w-16 bg-gray-200 rounded-full h-1.5 mr-2'>
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        vm.cpuUsage > 80 ? "bg-red-500" : 
                                        vm.cpuUsage > 60 ? "bg-yellow-500" : "bg-green-500"
                                      }`}
                                      style={{ width: `${vm.cpuUsage}%` }}
                                    ></div>
                                  </div>
                                  <span>{vm.cpuUsage}%</span>
                                </div>
                              </td>
                              <td className='px-4 py-3'>
                                <div className='flex items-center'>
                                  <div className='w-16 bg-gray-200 rounded-full h-1.5 mr-2'>
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        vm.memoryUsage > 80 ? "bg-red-500" : 
                                        vm.memoryUsage > 60 ? "bg-yellow-500" : "bg-green-500"
                                      }`}
                                      style={{ width: `${vm.memoryUsage}%` }}
                                    ></div>
                                  </div>
                                  <span>{vm.memoryUsage}%</span>
                                </div>
                              </td>
                              <td className='px-4 py-3'>
                                <div className='flex items-center'>
                                  <div className='w-16 bg-gray-200 rounded-full h-1.5 mr-2'>
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        vm.diskUsage > 80 ? "bg-red-500" : 
                                        vm.diskUsage > 60 ? "bg-yellow-500" : "bg-green-500"
                                      }`}
                                      style={{ width: `${vm.diskUsage}%` }}
                                    ></div>
                                  </div>
                                  <span>{vm.diskUsage}%</span>
                                </div>
                              </td>
                              <td className='px-4 py-3'>{vm.uptime}</td>
                              <td className='px-4 py-3'>{vm.os}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
          
          <TabsContent value='hosts' className='space-y-4 mt-4'>
            {!isConnected ? (
              <Alert>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  Please connect to your Zabbix server to view host data.
                </AlertDescription>
              </Alert>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Host Management</CardTitle>
                  <CardDescription>
                    View and manage monitored hosts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-500 mb-4'>
                    This section would allow you to add, edit, and remove hosts from Zabbix monitoring.
                    You would also be able to view detailed metrics and configure monitoring templates.
                  </p>
                  
                  <div className='border rounded-md p-4 bg-gray-50 text-center'>
                    <Server className='h-12 w-12 mx-auto text-gray-400 mb-2' />
                    <p className='text-gray-500'>Host management features will be available in the next update.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value='configuration' className='space-y-4 mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Zabbix Connection Settings</CardTitle>
                <CardDescription>
                  Configure your connection to the Zabbix monitoring server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='server-url'>Server URL</Label>
                    <Input 
                      id='server-url' 
                      placeholder='https://zabbix.example.com/api_jsonrpc.php' 
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                    />
                    <p className='text-xs text-gray-500'>
                      Enter the full URL to your Zabbix API endpoint
                    </p>
                  </div>
                  
                  <div className='space-y-2'>
                    <Label htmlFor='api-token'>API Token</Label>
                    <div className='flex'>
                      <Input 
                        id='api-token' 
                        type='password'
                        placeholder='Enter your Zabbix API token' 
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                        className='flex-1'
                      />
                      <Button 
                        variant='outline' 
                        size='icon'
                        className='ml-2'
                        title='Generate new token'
                        onClick={handleGenerateToken}
                      >
                        <Key className='h-4 w-4' />
                      </Button>
                    </div>
                    <p className='text-xs text-gray-500'>
                      API tokens provide secure access to the Zabbix API without using username/password
                    </p>
                  </div>
                  
                  <div className='flex items-center space-x-2 pt-2'>
                    <Switch 
                      id='auto-refresh' 
                      checked={autoRefresh} 
                      onCheckedChange={setAutoRefresh} 
                    />
                    <Label htmlFor='auto-refresh'>Enable auto-refresh (every 60 seconds)</Label>
                  </div>
                  
                  <div className='pt-4'>
                    <Button onClick={connectToZabbix} disabled={isConnecting}>
                      {isConnecting ? (
                        <>
                          <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Server className='h-4 w-4 mr-2' />
                          {isConnected ? 'Reconnect' : 'Connect to Zabbix'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure additional Zabbix integration settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Alert Notifications</p>
                      <p className='text-sm text-gray-500'>Receive notifications for Zabbix alerts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Automatic Host Discovery</p>
                      <p className='text-sm text-gray-500'>Automatically discover and add new hosts</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Sync Asset Inventory</p>
                      <p className='text-sm text-gray-500'>Sync Zabbix hosts with asset inventory</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className='pt-4'>
                    <Button variant='outline' onClick={handleAdditionalSettings}>
                      <Settings className='h-4 w-4 mr-2' />
                      Additional Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}