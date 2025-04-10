import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface LowStockItem {
  product: {
    id: number;
    name: string;
    sku: string;
    minStockLevel: number;
  };
  inventory: {
    quantity: number;
  };
}

export default function LowStockAlerts() {
  const { data: lowStockItems, isLoading } = useQuery({
    queryKey: ['/api/analytics/low-stock'],
  });

  const getIconClass = (productName: string) => {
    if (productName.toLowerCase().includes("phone") || productName.toLowerCase().includes("galaxy")) {
      return "ri-smartphone-line";
    } else if (productName.toLowerCase().includes("tv")) {
      return "ri-tv-line";
    } else if (productName.toLowerCase().includes("shirt") || productName.toLowerCase().includes("t-shirt")) {
      return "ri-shirt-line";
    } else if (productName.toLowerCase().includes("headphone")) {
      return "ri-headphone-line";
    } else {
      return "ri-box-3-line";
    }
  };

  const getStockStatus = (quantity: number, minLevel: number) => {
    const ratio = quantity / minLevel;
    if (ratio <= 0.3) return "text-red-600";
    if (ratio <= 0.8) return "text-amber-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Low Stock Alerts</h3>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-14"></div>
                </div>
              </div>
            ))}
          </div>
        ) : lowStockItems && lowStockItems.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {lowStockItems.slice(0, 3).map((item: LowStockItem) => (
              <li key={item.product.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <i className={`${getIconClass(item.product.name)} text-gray-500`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.product.name}</p>
                    <p className="text-sm text-gray-500">SKU: #{item.product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${getStockStatus(item.inventory.quantity, item.product.minStockLevel)}`}>
                    Only {item.inventory.quantity} left
                  </p>
                  <p className="text-sm text-gray-500">Min: {item.product.minStockLevel}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-6 text-center">
            <p className="text-gray-500">No low stock items found</p>
          </div>
        )}
        <div className="mt-4">
          <Link href="/inventory">
            <a className="w-full py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 block text-center">
              View All Alerts
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
