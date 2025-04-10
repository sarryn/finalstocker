import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, MapPin, PhoneCall } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
}

export default function Locations() {
  const [search, setSearch] = useState("");

  const { data: locations, isLoading } = useQuery({
    queryKey: ['/api/locations'],
  });

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ['/api/inventory'],
  });

  // Filter locations based on search term
  const filteredLocations = !isLoading && locations
    ? locations.filter((location: Location) => 
        location.name.toLowerCase().includes(search.toLowerCase()) ||
        location.city.toLowerCase().includes(search.toLowerCase()) ||
        location.state.toLowerCase().includes(search.toLowerCase()) ||
        location.pincode.includes(search)
      )
    : [];

  // Get inventory count for each location
  const getInventoryCount = (locationId: number) => {
    if (inventoryLoading || !inventory) return 0;
    
    const locationInventory = inventory.filter((inv: any) => inv.locationId === locationId);
    return locationInventory.reduce((sum: number, inv: any) => sum + inv.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Locations" 
        subtitle="Manage your store locations and warehouses"
        actions={
          <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Location
          </button>
        }
      />

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations by name, city, state or pincode..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading state
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="mt-4 h-10 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : filteredLocations.length > 0 ? (
          filteredLocations.map((location: Location) => (
            <div key={location.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{location.name}</h3>
                  {location.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    <span>{location.address}, {location.city}, {location.state} - {location.pincode}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneCall className="w-4 h-4 mr-2 text-gray-400" />
                    <span>+91 9876543210</span>
                  </div>
                </div>
                
                <div className="flex space-x-4 text-sm">
                  <div>
                    <span className="text-gray-500">Products:</span>
                    <span className="ml-1 font-semibold text-gray-800">{getInventoryCount(location.id)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Categories:</span>
                    <span className="ml-1 font-semibold text-gray-800">5</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Staff:</span>
                    <span className="ml-1 font-semibold text-gray-800">8</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button className="text-primary-600 hover:text-primary-900 text-sm">
                  <i className="ri-edit-line mr-1"></i> Edit
                </button>
                <button className="text-primary-600 hover:text-primary-900 text-sm">
                  <i className="ri-eye-line mr-1"></i> View Inventory
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow p-8 text-center">
            <div className="flex flex-col items-center">
              <i className="ri-map-pin-line text-4xl text-gray-300 mb-2"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No locations found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or add a new location</p>
              <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <i className="ri-add-line mr-1"></i> Add Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
