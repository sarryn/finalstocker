import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface ScannedItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface RecentlyScannedItemsProps {
  items: ScannedItem[];
  isLoading?: boolean;
  onUpdateInventory?: () => void;
}

export default function RecentlyScannedItems({ 
  items = [], 
  isLoading = false,
  onUpdateInventory 
}: RecentlyScannedItemsProps) {
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>(() => {
    return items.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {} as Record<number, number>);
  });
  
  const { toast } = useToast();

  const updateQuantity = (id: number, delta: number) => {
    setItemQuantities(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      return { ...prev, [id]: newQty };
    });
  };

  const handleInventoryUpdate = async () => {
    try {
      // Create inventory updates for each item
      const updates = Object.entries(itemQuantities).map(([idStr, quantity]) => {
        const id = parseInt(idStr);
        const item = items.find(i => i.id === id);
        if (!item) return null;
        
        return {
          productId: id,
          locationId: 1, // Default to main location
          quantity
        };
      }).filter(Boolean);
      
      if (updates.length === 0) {
        toast({
          title: "No items to update",
          description: "Scan items or adjust quantities first",
          variant: "destructive"
        });
        return;
      }
      
      // Submit each update to the API
      for (const update of updates) {
        await apiRequest('POST', '/api/inventory', update);
      }
      
      // Invalidate inventory queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/inventory-value'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/inventory-count'] });
      
      toast({
        title: "Inventory updated",
        description: `Successfully updated ${updates.length} ${updates.length === 1 ? 'item' : 'items'}`
      });
      
      // Call the onUpdateInventory callback if provided
      if (onUpdateInventory) {
        onUpdateInventory();
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast({
        title: "Update failed",
        description: "Could not update inventory. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getItemIcon = (name: string) => {
    if (name.toLowerCase().includes("headphone")) {
      return "ri-headphone-line";
    } else if (name.toLowerCase().includes("mouse")) {
      return "ri-mouse-line";
    } else if (name.toLowerCase().includes("phone") || name.toLowerCase().includes("galaxy")) {
      return "ri-smartphone-line";
    } else {
      return "ri-cube-line";
    }
  };

  // Format as Indian Rupees
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Recently Scanned Items</h3>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <i className={`${getItemIcon(item.name)} text-gray-500`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">SKU: #{item.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="px-2 py-1 bg-primary-50 text-primary-700 rounded hover:bg-primary-100"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span className="text-gray-800 font-medium">{itemQuantities[item.id] || 0}</span>
                    <button 
                      className="px-2 py-1 bg-primary-50 text-primary-700 rounded hover:bg-primary-100"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formatCurrency(item.price)} per unit</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No items scanned yet</p>
            <p className="text-sm text-gray-400 mt-1">Scan a barcode to add items</p>
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button 
            className="py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={handleInventoryUpdate}
            disabled={items.length === 0}
          >
            Update Inventory
          </button>
          <button className="py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            View All Scanned
          </button>
        </div>
      </div>
    </div>
  );
}
