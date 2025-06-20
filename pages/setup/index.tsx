
import { useState } from "react";
import { useRouter } from "next/router";
import { Check, Database, Key, Lock, Server, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function SetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  
  // Admin account form
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  // Database connection form
  const [dbForm, setDbForm] = useState({
    host: "localhost",
    port: "5432",
    database: "it_asset_manager",
    username: "postgres",
    password: ""
  });
  
  // Import options
  const [importOptions, setImportOptions] = useState({
    assets: true,
    users: true,
    components: true,
    accessories: true,
    licenses: true,
    zabbixVms: true,
    activityLogs: true,
    bitlockerKeys: true
  });
  
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  
  const handleAdminFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDbFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDbForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImportOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setImportOptions(prev => ({ ...prev, [name]: checked }));
  };
  
  const validateAdminForm = () => {
    if (!adminForm.name.trim()) {
      toast({ title: "Error", description: "Admin name is required" });
      return false;
    }
    
    if (!adminForm.email.trim() || !/\S+@\S+\.\S+/.test(adminForm.email)) {
      toast({ title: "Error", description: "Valid email address is required" });
      return false;
    }
    
    if (adminForm.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters" });
      return false;
    }
    
    if (adminForm.password !== adminForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match" });
      return false;
    }
    
    return true;
  };
  
  const validateDbForm = () => {
    if (!dbForm.host.trim()) {
      toast({ title: "Error", description: "Database host is required" });
      return false;
    }
    
    if (!dbForm.port.trim() || isNaN(Number(dbForm.port))) {
      toast({ title: "Error", description: "Valid database port is required" });
      return false;
    }
    
    if (!dbForm.database.trim()) {
      toast({ title: "Error", description: "Database name is required" });
      return false;
    }
    
    if (!dbForm.username.trim()) {
      toast({ title: "Error", description: "Database username is required" });
      return false;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (currentStep === 1 && !validateAdminForm()) {
      return;
    }
    
    if (currentStep === 2 && !validateDbForm()) {
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleTestConnection = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API endpoint to test the connection
      const response = await fetch("/api/setup/test-db-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dbForm),
      });
      
      if (!response.ok) {
        throw new Error("Failed to connect to database");
      }
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the PostgreSQL database",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFinish = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API endpoint to complete the setup
      const response = await fetch("/api/setup/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin: adminForm,
          database: dbForm,
          importOptions,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to complete setup");
      }
      
      setSetupComplete(true);
      
      toast({
        title: "Setup Complete",
        description: "Your IT Asset Management System is ready to use!",
      });
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to complete setup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (setupComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
            <CardDescription>
              Your IT Asset Management System has been successfully configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center mb-6">
              All data has been imported and your admin account has been created.
              You will be redirected to the dashboard in a few seconds.
            </p>
            <Button onClick={() => router.push("/")} className="w-full max-w-xs">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">IT Asset Management System Setup</CardTitle>
          <CardDescription>
            Complete this setup wizard to configure your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
          
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Create Admin Account</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="John Doe" 
                      value={adminForm.name}
                      onChange={handleAdminFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="admin@example.com" 
                      value={adminForm.email}
                      onChange={handleAdminFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      value={adminForm.password}
                      onChange={handleAdminFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={adminForm.confirmPassword}
                      onChange={handleAdminFormChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Database className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Configure Database Connection</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">Database Host</Label>
                    <Input 
                      id="host" 
                      name="host" 
                      placeholder="localhost" 
                      value={dbForm.host}
                      onChange={handleDbFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input 
                      id="port" 
                      name="port" 
                      placeholder="5432" 
                      value={dbForm.port}
                      onChange={handleDbFormChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input 
                    id="database" 
                    name="database" 
                    placeholder="it_asset_manager" 
                    value={dbForm.database}
                    onChange={handleDbFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username" 
                    placeholder="postgres" 
                    value={dbForm.username}
                    onChange={handleDbFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={dbForm.password}
                    onChange={handleDbFormChange}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Server className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Data Import Options</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Select which data you would like to import from the mock data into your PostgreSQL database.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="assets" 
                    name="assets"
                    checked={importOptions.assets}
                    onChange={handleImportOptionChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="assets">Assets (Computers, Servers, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="users" 
                    name="users"
                    checked={importOptions.users}
                    onChange={handleImportOptionChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="users">Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="components" 
                    name="components"
                    checked={importOptions.components}
                    onChange={handleImportOptionChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="components">Components (RAM, CPU, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="accessories" 
                    name="accessories"
                    checked={importOptions.accessories}
                    onChange={handleImportOptionChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="accessories">Accessories (Keyboards, Mice, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="licenses" 
                    name="licenses"
                    checked={importOptions.licenses}
                    onChange={handleImportOptionChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="licenses">Software Licenses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="zabbixVms" 
                    name="zabbixVms"
                    checked={importOptions.zabbixVms}
                    onChange={handleImportOptionChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="zabbixVms">Zabbix VM Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="activityLogs" 
                    name="activityLogs"
                    checked={importOptions.activityLogs}
                    onChange={handleImportOptionChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="activityLogs">Activity Logs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="bitlockerKeys" 
                    name="bitlockerKeys"
                    checked={importOptions.bitlockerKeys}
                    onChange={handleImportOptionChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="bitlockerKeys">BitLocker Recovery Keys</Label>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Confirm Setup</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Please review your setup information before finalizing.
              </p>
              
              <Tabs defaultValue="admin">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="admin">Admin Account</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                  <TabsTrigger value="import">Import Options</TabsTrigger>
                </TabsList>
                <TabsContent value="admin" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Name:</span>
                      <span>{adminForm.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Email:</span>
                      <span>{adminForm.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Password:</span>
                      <span>••••••••</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="database" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Host:</span>
                      <span>{dbForm.host}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Port:</span>
                      <span>{dbForm.port}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Database:</span>
                      <span>{dbForm.database}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Username:</span>
                      <span>{dbForm.username}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Password:</span>
                      <span>••••••••</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="import" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    {Object.entries(importOptions).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:
                        </span>
                        <span>{value ? "Yes" : "No"}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button 
              onClick={handleFinish}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
