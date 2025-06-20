import { useEffect, useState } from "react";
import { Activity, Filter, Calendar, Search, User, Monitor, Key, Server } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityLog } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [allLogs, setAllLogs] = useState<ActivityLog[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/activity-logs")
      .then((res) => res.json())
      .then((data) => {
        setAllLogs(data);
        setFilteredLogs(data);
      })
      .catch((error) => {
        console.error("Failed to load activity logs", error);
        toast({
          title: "Error",
          description: "Failed to load activity logs.",
          variant: "destructive"
        });
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterLogs(query, typeFilter);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    filterLogs(searchQuery, value);
  };

  const filterLogs = (query: string, type: string) => {
    let filtered = [...allLogs];

    if (type !== 'all') {
      filtered = filtered.filter(log => log.itemType === type);
    }

    if (query.trim() !== '') {
      filtered = filtered.filter(log =>
        log.details.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.itemType.toLowerCase().includes(query)
      );
    }

    setFilteredLogs(filtered);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'asset': return <Monitor className='h-4 w-4' />;
      case 'user': return <User className='h-4 w-4' />;
      case 'license': return <Key className='h-4 w-4' />;
      case 'vm': return <Server className='h-4 w-4' />;
      default: return <Activity className='h-4 w-4' />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleDateRange = () => {
    toast({
      title: 'Date Range',
      description: 'Date range filter will be available soon.',
    });
  };

  const handleAdvancedFilters = () => {
    toast({
      title: 'Advanced Filters',
      description: 'Advanced filtering options will be available soon.',
    });
  };

  const handleLoadMore = () => {
    toast({
      title: 'Loading More',
      description: 'Loading additional activity logs.',
    });
  };

    return (
    <Layout title='Activity Log | IT Asset Manager'>
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <h1 className='text-2xl font-bold tracking-tight'>Activity Log</h1>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleDateRange}>
              <Calendar className='h-4 w-4 mr-2' />
              Date Range
            </Button>
            <Button variant='outline' onClick={handleAdvancedFilters}>
              <Filter className='h-4 w-4 mr-2' />
              Advanced Filters
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>
              Track all actions performed in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4 mb-6'>
              <div className='relative flex-1'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
                <Input
                  placeholder='Search activities...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className='w-full sm:w-48'>
                <Select value={typeFilter} onValueChange={handleTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder='Filter by type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Types</SelectItem>
                    <SelectItem value='asset'>Assets</SelectItem>
                    <SelectItem value='user'>Users</SelectItem>
                    <SelectItem value='component'>Components</SelectItem>
                    <SelectItem value='accessory'>Accessories</SelectItem>
                    <SelectItem value='license'>Licenses</SelectItem>
                    <SelectItem value='bitlocker'>BitLocker</SelectItem>
                    <SelectItem value='vm'>Virtual Machines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-4'>
  {filteredLogs.length > 0 ? (
    filteredLogs.map((log) => (
      <div key={log.id} className='flex border-b pb-4 last:border-0'>
        <div className='mr-4 mt-1'>
          <div className={`p-2 rounded-full ${
            log.action === 'create' ? 'bg-green-100 text-green-600' :
            log.action === 'update' ? 'bg-blue-100 text-blue-600' :
            log.action === 'delete' ? 'bg-red-100 text-red-600' :
            log.action === 'checkout' ? 'bg-purple-100 text-purple-600' :
            log.action === 'checkin' ? 'bg-yellow-100 text-yellow-600' :
            log.action === 'assign' ? 'bg-indigo-100 text-indigo-600' :
            log.action === 'access' ? 'bg-orange-100 text-orange-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {getActivityIcon(log.itemType)}
          </div>
        </div>
        <div className='flex-1'>
          <div className='flex flex-col sm:flex-row sm:justify-between'>
            <p className='font-medium'>{log.details}</p>
            <p className='text-sm text-gray-500'>{formatDate(log.timestamp)}</p>
          </div>
          <div className='flex flex-wrap gap-2 mt-1'>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              log.action === 'create' ? 'bg-green-100 text-green-800' :
              log.action === 'update' ? 'bg-blue-100 text-blue-800' :
              log.action === 'delete' ? 'bg-red-100 text-red-800' :
              log.action === 'checkout' ? 'bg-purple-100 text-purple-800' :
              log.action === 'checkin' ? 'bg-yellow-100 text-yellow-800' :
              log.action === 'assign' ? 'bg-indigo-100 text-indigo-800' :
              log.action === 'access' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
            </span>
            <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize'>
              {log.itemType}
            </span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className='text-center py-8'>
      <Activity className='h-12 w-12 mx-auto text-gray-300 mb-2' />
      <h3 className='text-lg font-medium mb-1'>No activities found</h3>
      <p className='text-gray-500'>
        Try adjusting your search or filter criteria
      </p>
    </div>
  )}
</div>
{filteredLogs.length > 0 && (
  <div className='flex justify-center mt-6'>
    <Button variant='outline' onClick={handleLoadMore}>Load More</Button>
  </div>
)}
</CardContent>
</Card>
</div>
</Layout>
  );
}
           
