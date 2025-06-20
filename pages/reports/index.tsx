
import { useState } from "react";
import { FileText, Download, Calendar, Filter, RefreshCw } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAssets, mockUsers, mockLicenses } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label"; // Added Label import

// Helper function to safely format optional dates
const formatOptionalDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }
  try {
    const date = new Date(dateString);
    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    // Format valid date using locale-sensitive formatting
    return date.toLocaleDateString(undefined, { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return 'Error'; // Indicate an error occurred during formatting
  }
};

export default function ReportsPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('assets');
  const [timeframe, setTimeframe] = useState('month');
  
  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: 'Report Generated',
        description: `Your ${reportType} report has been generated successfully.`,
      });
    }, 1500);
  };
  
  const downloadReport = (format: string) => {
    toast({
      title: 'Download Started',
      description: `Your report is being downloaded as ${format.toUpperCase()}.`,
    });
  };
  
  return (
    <Layout title='Reports | IT Asset Manager'>
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <h1 className='text-2xl font-bold tracking-tight'>Reports</h1>
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <FileText className='h-4 w-4 mr-2' />
                Generate Report
              </>
            )}
          </Button>
        </div>
        
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>
              Configure and generate reports for your IT assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <Label className='block text-sm font-medium mb-2'>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select report type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='assets'>Asset Inventory</SelectItem>
                    <SelectItem value='licenses'>License Utilization</SelectItem>
                    <SelectItem value='users'>User Activity</SelectItem>
                    <SelectItem value='maintenance'>Maintenance History</SelectItem>
                    <SelectItem value='network'>Network Devices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className='block text-sm font-medium mb-2'>Time Period</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select time period' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='week'>Last Week</SelectItem>
                    <SelectItem value='month'>Last Month</SelectItem>
                    <SelectItem value='quarter'>Last Quarter</SelectItem>
                    <SelectItem value='year'>Last Year</SelectItem>
                    <SelectItem value='all'>All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className='block text-sm font-medium mb-2'>Export Format</Label>
                <div className='flex gap-2'>
                  <Button 
                    variant='outline' 
                    size='sm' 
                    onClick={() => downloadReport('pdf')}
                  >
                    <Download className='h-4 w-4 mr-1' />
                    PDF
                  </Button>
                  <Button 
                    variant='outline' 
                    size='sm' 
                    onClick={() => downloadReport('csv')}
                  >
                    <Download className='h-4 w-4 mr-1' />
                    CSV
                  </Button>
                  <Button 
                    variant='outline' 
                    size='sm' 
                    onClick={() => downloadReport('excel')}
                  >
                    <Download className='h-4 w-4 mr-1' />
                    Excel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="assets">
          <TabsList>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assets" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Inventory Report</CardTitle>
                <CardDescription>
                  Overview of all IT assets in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Asset Distribution by Category</h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {["laptop", "desktop", "server", "network", "mobile"].map(category => {
                      const count = mockAssets.filter(asset => asset.category.toLowerCase() === category).length; // Ensure case-insensitive comparison
                      return (
                        <div key={category} className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-sm text-gray-500 capitalize">{category}s</p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Asset Status Overview</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["deployed", "available", "maintenance", "decommissioned"].map(status => {
                      const count = mockAssets.filter(asset => asset.status === status).length;
                      return (
                        <div key={status} className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-sm text-gray-500 capitalize">{status}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="licenses" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>License Utilization Report</CardTitle>
                <CardDescription>
                  Overview of software licenses and their utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">License Utilization</h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {mockLicenses.map(license => {
                      // Avoid division by zero if seats is 0
                      const utilizationPercentage = license.seats > 0 
                        ? ((license.seats - license.seatsAvailable) / license.seats) * 100 
                        : 0; 

                      return (
                        <div key={license.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{license.name}</span>
                            <span className="text-sm">{license.seats - license.seatsAvailable} / {license.seats} seats used</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                utilizationPercentage > 90 ? "bg-red-600" : 
                                utilizationPercentage > 70 ? "bg-yellow-600" : "bg-green-600"
                              }`}
                              style={{ width: `${utilizationPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            {/* Use the helper function to format the date */}
                            <span>Expires: {formatOptionalDate(license.expirationDate)}</span> 
                            <span>{Math.round(utilizationPercentage)}% utilized</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Report</CardTitle>
                <CardDescription>
                  Overview of user activity and asset assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">User Asset Distribution</h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {mockUsers.map(user => {
                      const assignedAssets = mockAssets.filter(asset => asset.assignedTo === user.id);
                      return (
                        <div key={user.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm">{user.department}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-sm font-medium mb-1">Assigned Assets: {assignedAssets.length}</p>
                            <div className="text-xs text-gray-500">
                              {assignedAssets.length > 0 ? (
                                assignedAssets.map(asset => (
                                  <div key={asset.id} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                                    {/* Use asset.model instead of asset.name */}
                                    <span>{asset.model}</span> 
                                    <span>{asset.assetTag}</span>
                                  </div>
                                ))
                              ) : (
                                <p>No assets assigned</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>
                  Create and save custom report templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Custom Reports</h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">
                    Create custom reports with specific fields, filters, and visualizations to meet your organization's needs.
                  </p>
                  <Button>Create Custom Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
