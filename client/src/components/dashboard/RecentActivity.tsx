import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface ActivityLog {
  id: number;
  action: string;
  entity: string;
  entityId: number;
  details: any;
  timestamp: string;
}

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activity'],
  });

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "STOCK_RECEIVED":
        return "ri-shopping-basket-2-line text-green-600";
      case "PRICE_UPDATE":
        return "ri-price-tag-3-line text-blue-600";
      case "ORDER_PLACED":
        return "ri-truck-line text-amber-600";
      case "SALE_COMPLETED":
        return "ri-shopping-cart-line text-purple-600";
      case "INVENTORY_ADJUSTED":
        return "ri-scales-line text-cyan-600";
      default:
        return "ri-information-line text-gray-600";
    }
  };

  const getActivityIconBg = (action: string) => {
    switch (action) {
      case "STOCK_RECEIVED":
        return "bg-green-100";
      case "PRICE_UPDATE":
        return "bg-blue-100";
      case "ORDER_PLACED":
        return "bg-amber-100";
      case "SALE_COMPLETED":
        return "bg-purple-100";
      case "INVENTORY_ADJUSTED":
        return "bg-cyan-100";
      default:
        return "bg-gray-100";
    }
  };

  const getActivityText = (activity: ActivityLog) => {
    switch (activity.action) {
      case "STOCK_RECEIVED":
        return (
          <>
            <span className="font-medium">Stock received</span> - {activity.details.quantity} units of {activity.details.productName} added to inventory
          </>
        );
      case "PRICE_UPDATE":
        return (
          <>
            <span className="font-medium">Price update</span> - {activity.details.productName} prices increased by {((activity.details.newPrice / activity.details.oldPrice - 1) * 100).toFixed(1)}%
          </>
        );
      case "ORDER_PLACED":
        return (
          <>
            <span className="font-medium">Order placed</span> - PO #{activity.details.poNumber} sent to {activity.details.supplierName}
          </>
        );
      default:
        return <span className="font-medium">{activity.action.replace(/_/g, " ")}</span>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <i className="ri-history-line text-blue-500 mr-2"></i>
          Recent Activity
        </h3>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-start">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 mt-1"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {activities.slice(0, 3).map((activity: ActivityLog) => (
              <li key={activity.id} className="py-3 flex items-start">
                <div className={`w-8 h-8 rounded-full ${getActivityIconBg(activity.action)} flex items-center justify-center mr-3 mt-1`}>
                  <i className={getActivityIcon(activity.action)}></i>
                </div>
                <div>
                  <p className="text-gray-800">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-6 text-center">
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
        <div className="mt-4">
          <button className="w-full py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center">
            <i className="ri-history-line mr-1"></i> View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
