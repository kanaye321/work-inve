
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLog } from "@/types";
import { useEffect, useState } from "react";

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  // Use client-side rendering for date formatting to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const getActivityIcon = (itemType: string) => {
    switch (itemType) {
      case "asset":
        return "💻";
      case "user":
        return "👤";
      case "component":
        return "🔧";
      case "accessory":
        return "🖱️";
      case "license":
        return "📄";
      case "bitlocker":
        return "🔒";
      case "vm":
        return "☁️";
      case "system":
        return "⚙️";
      default:
        return "📝";
    }
  };

  // Format date in a consistent way for both server and client
  const formatDate = (dateString: string) => {
    if (!isClient) {
      return dateString; // Return ISO string on server
    }
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="text-2xl">{getActivityIcon(activity.itemType)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.details}</p>
                  <p className="text-xs text-gray-500">
                    {isClient ? formatDate(activity.timestamp) : activity.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent activities</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
