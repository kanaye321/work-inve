import { useState } from "react";
import { Settings, Save, User, Bell, Shield, Database, Globe, Moon, Sun, Laptop } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  // Add handlers for previously non-functional buttons
  const handleChangePassword = () => {
    toast({
      title: 'Change Password',
      description: 'Password change functionality will be available soon.',
    });
  };

  const handleEnable2FA = () => {
    toast({
      title: '2FA Setup',
      description: 'Two-factor authentication setup will be available soon.',
    });
  };

  const handleViewHistory = () => {
    toast({
      title: 'Login History',
      description: 'Viewing login history will be available soon.',
    });
  };

  const handleRegenerateApiKey = () => {
    toast({
      title: 'API Key Regenerated',
      description: 'Your API key has been regenerated successfully.',
    });
  };

  const handleConfigureZabbix = () => {
    toast({
      title: 'Zabbix Configuration',
      description: 'Redirecting to Zabbix configuration page.',
    });
    // In a real app, this would navigate to the Zabbix configuration page
  };

  const handleConnectService = (service: string) => {
    toast({
      title: `Connect to ${service}`,
      description: `Setting up connection to ${service}.`,
    });
  };

  const handleBrowseIntegrations = () => {
    toast({
      title: 'Browse Integrations',
      description: 'Exploring available integrations.',
    });
  };
  
  return (
    <Layout title='Settings | SRPH MIS Inventory Manager'>
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <h1 className='text-2xl font-bold tracking-tight'>Settings | Disabled</h1>
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Settings className='h-4 w-4 mr-2 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                Save Settings
              </>
            )}
          </Button>
        </div>
        
        <Tabs defaultValue='general'>
          <TabsList>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='account'>Account</TabsTrigger>
            <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            <TabsTrigger value='security'>Security</TabsTrigger>
            <TabsTrigger value='integrations'>Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value='general' className='space-y-4 mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general application settings
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='company-name'>Company Name</Label>
                  <Input id='company-name' defaultValue='SRPH | MIS' />
                </div>
                
                <div className='space-y-2'>
                  <Label htmlFor='timezone'>Timezone</Label>
                  <Select defaultValue='utc'>
                    <SelectTrigger id='timezone'>
                      <SelectValue placeholder='Select timezone' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='utc'>UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value='est'>EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value='cst'>CST (Central Standard Time)</SelectItem>
                      <SelectItem value='mst'>MST (Mountain Standard Time)</SelectItem>
                      <SelectItem value='pst'>PST (Pacific Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='space-y-2'>
                  <Label htmlFor='date-format'>Date Format</Label>
                  <Select defaultValue='mdy'>
                    <SelectTrigger id='date-format'>
                      <SelectValue placeholder='Select date format' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='mdy'>MM/DD/YYYY</SelectItem>
                      <SelectItem value='dmy'>DD/MM/YYYY</SelectItem>
                      <SelectItem value='ymd'>YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='space-y-2'>
                  <Label>Theme</Label>
                  <div className='flex space-x-4'>
                    <div className='flex items-center space-x-2'>
                      <input 
                        type='radio' 
                        id='theme-light' 
                        name='theme' 
                        value='light' 
                        defaultChecked 
                        className='h-4 w-4'
                      />
                      <Label htmlFor='theme-light' className='flex items-center'>
                        <Sun className='h-4 w-4 mr-1' />
                        Light
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <input 
                        type='radio' 
                        id='theme-dark' 
                        name='theme' 
                        value='dark' 
                        className='h-4 w-4'
                      />
                      <Label htmlFor='theme-dark' className='flex items-center'>
                        <Moon className='h-4 w-4 mr-1' />
                        Dark
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <input 
                        type='radio' 
                        id='theme-system' 
                        name='theme' 
                        value='system' 
                        className='h-4 w-4'
                      />
                      <Label htmlFor='theme-system' className='flex items-center'>
                        <Laptop className='h-4 w-4 mr-1' />
                        System
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className='space-y-2'>
                  <Label>Language</Label>
                  <Select defaultValue='en'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select language' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='en'>English</SelectItem>
                      <SelectItem value='es'>Spanish</SelectItem>
                      <SelectItem value='fr'>French</SelectItem>
                      <SelectItem value='de'>German</SelectItem>
                      <SelectItem value='ja'>Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value='account' className='space-y-4 mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input id='name' defaultValue='SRPH MIS' />
                </div>
                
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input id='email' type='email' defaultValue='N/A' />
                </div>
                
                <div className='space-y-2'>
                  <Label htmlFor='role'>Role</Label>
                  <Input id='role' defaultValue='Administrator' disabled />
                  <p className='text-xs text-gray-500'>Contact your system administrator to change roles</p>
                </div>
                
                <div className='space-y-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input id='password' type='password' value='••••••••••••' />
                  <Button variant='outline' size='sm' onClick={handleChangePassword}>Change Password</Button>
                </div>
                
                <div className='space-y-2'>
                  <Label>Two-Factor Authentication</Label>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm'>Protect your account with 2FA</p>
                      <p className='text-xs text-gray-500'>Currently disabled</p>
                    </div>
                    <Button variant='outline' size='sm' onClick={handleEnable2FA}>
                      <Shield className='h-4 w-4 mr-2' />
                      Enable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value='notifications' className='space-y-4 mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Email Notifications</p>
                      <p className='text-sm text-gray-500'>Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Browser Notifications</p>
                      <p className='text-sm text-gray-500'>Receive notifications in your browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Mobile Push Notifications</p>
                      <p className='text-sm text-gray-500'>Receive notifications on your mobile device</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className='pt-4 border-t'>
                  <h3 className='text-lg font-medium mb-4'>Notification Types</h3>
                  
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>Asset Assignments</p>
                        <p className='text-sm text-gray-500'>When assets are assigned or unassigned</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>License Expirations</p>
                        <p className='text-sm text-gray-500'>When licenses are about to expire</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>Maintenance Alerts</p>
                        <p className='text-sm text-gray-500'>When assets require maintenance</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>System Updates</p>
                        <p className='text-sm text-gray-500'>When the system is updated</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value='security' className='space-y-4 mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security settings for your account
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Two-Factor Authentication</p>
                      <p className='text-sm text-gray-500'>Add an extra layer of security to your account</p>
                    </div>
                    <Button variant='outline' onClick={handleEnable2FA}>
                      <Shield className='h-4 w-4 mr-2' />
                      Enable
                    </Button>
                  </div>
                  
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Session Timeout</p>
                      <p className='text-sm text-gray-500'>Automatically log out after inactivity</p>
                    </div>
                    <Select defaultValue='30'>
                      <SelectTrigger className='w-32'>
                        <SelectValue placeholder='Select time' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='15'>15 minutes</SelectItem>
                        <SelectItem value='30'>30 minutes</SelectItem>
                        <SelectItem value='60'>1 hour</SelectItem>
                        <SelectItem value='120'>2 hours</SelectItem>
                        <SelectItem value='never'>Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Login History</p>
                      <p className='text-sm text-gray-500'>View your recent login activity</p>
                    </div>
                    <Button variant='outline' onClick={handleViewHistory}>View History</Button>
                  </div>
                </div>
                
                <div className='pt-4 border-t'>
                  <h3 className='text-lg font-medium mb-4'>API Access</h3>
                  
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>API Access</p>
                        <p className='text-sm text-gray-500'>Enable API access for integrations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className='space-y-2'>
                      <Label htmlFor='api-key'>API Key</Label>
                      <div className='flex'>
                        <Input 
                          id='api-key' 
                          value='••••••••••••••••••••••••••••••' 
                          disabled 
                          className='flex-1'
                        />
                        <Button variant='outline' className='ml-2' onClick={handleRegenerateApiKey}>
                          Regenerate
                        </Button>
                      </div>
                      <p className='text-xs text-gray-500'>
                        Keep your API key secret. Regenerating will invalidate your existing key.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value='integrations' className='space-y-4 mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect with other services and tools
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between border p-4 rounded-lg'>
                    <div className='flex items-center'>
                      <div className='bg-blue-100 p-2 rounded-lg mr-4'>
                        <Database className='h-6 w-6 text-blue-600' />
                      </div>
                      <div>
                        <p className='font-medium'>Zabbix Integration</p>
                        <p className='text-sm text-gray-500'>Connect to Zabbix for server monitoring</p>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-sm text-green-600 mr-2'>Connected</span>
                      <Button variant='outline' size='sm' onClick={handleConfigureZabbix}>Configure</Button>
                    </div>
                  </div>
                  
                  <div className='flex items-center justify-between border p-4 rounded-lg'>
                    <div className='flex items-center'>
                      <div className='bg-purple-100 p-2 rounded-lg mr-4'>
                        <Globe className='h-6 w-6 text-purple-600' />
                      </div>
                      <div>
                        <p className='font-medium'>Active Directory</p>
                        <p className='text-sm text-gray-500'>Sync users with Active Directory</p>
                      </div>
                    </div>
                    <Button variant='outline' size='sm' onClick={() => handleConnectService('Active Directory')}>Connect</Button>
                  </div>
                  
                  <div className='flex items-center justify-between border p-4 rounded-lg'>
                    <div className='flex items-center'>
                      <div className='bg-green-100 p-2 rounded-lg mr-4'>
                        <Bell className='h-6 w-6 text-green-600' />
                      </div>
                      <div>
                        <p className='font-medium'>Slack Notifications</p>
                        <p className='text-sm text-gray-500'>Send notifications to Slack channels</p>
                      </div>
                    </div>
                    <Button variant='outline' size='sm' onClick={() => handleConnectService('Slack')}>Connect</Button>
                  </div>
                  
                  <div className='flex items-center justify-between border p-4 rounded-lg'>
                    <div className='flex items-center'>
                      <div className='bg-yellow-100 p-2 rounded-lg mr-4'>
                        <User className='h-6 w-6 text-yellow-600' />
                      </div>
                      <div>
                        <p className='font-medium'>JIRA Integration</p>
                        <p className='text-sm text-gray-500'>Create tickets from asset issues</p>
                      </div>
                    </div>
                    <Button variant='outline' size='sm' onClick={() => handleConnectService('JIRA')}>Connect</Button>
                  </div>
                </div>
                
                <div className='pt-4'>
                  <Button variant='outline' onClick={handleBrowseIntegrations}>
                    <Globe className='h-4 w-4 mr-2' />
                    Browse More Integrations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}