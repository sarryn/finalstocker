import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw, Download } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import SalesChart from "@/components/dashboard/SalesChart";
import InventoryStatusChart from "@/components/dashboard/InventoryStatusChart";
import LowStockAlerts from "@/components/dashboard/LowStockAlerts";
import RecentActivity from "@/components/dashboard/RecentActivity";
import InventoryTable from "@/components/dashboard/InventoryTable";
import AIForecastingSection from "@/components/dashboard/AIForecastingSection";

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30days");

  const { data: locations } = useQuery({
    queryKey: ['/api/locations'],
  });

  const { data: inventoryValue, isLoading: valueLoading } = useQuery({
    queryKey: ['/api/analytics/inventory-value', selectedLocation !== 'all' ? parseInt(selectedLocation) : undefined],
  });

  const { data: inventoryCount, isLoading: countLoading } = useQuery({
    queryKey: ['/api/analytics/inventory-count', selectedLocation !== 'all' ? parseInt(selectedLocation) : undefined],
  });

  const { data: lowStock } = useQuery({
    queryKey: ['/api/analytics/low-stock'],
  });

  const handleRefresh = () => {
    // Invalidate and refetch all dashboard queries
    [
      '/api/analytics/inventory-value',
      '/api/analytics/inventory-count',
      '/api/analytics/low-stock',
      '/api/activity'
    ].forEach(key => {
      window.queryClient?.invalidateQueries({ queryKey: [key] });
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-48 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-map-pin-line text-gray-500"></i>
            </div>
            <select 
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {locations?.map((location: any) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-calendar-line text-gray-500"></i>
            </div>
            <select 
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-primary-800 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
            onClick={handleRefresh}
          >
            <RefreshCcw className="w-4 h-4 mr-1" /> Refresh
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Inventory Value"
          value={inventoryValue?.value || 0}
          change={{ value: "12.5%", isPositive: true }}
          icon="ri-money-rupee-circle-line"
          iconBgColor="bg-primary-50"
          iconColor="text-primary-600"
        />
        
        <KpiCard
          title="Stock Items"
          value={inventoryCount?.count || 0}
          change={{ value: "3.2%", isPositive: true }}
          icon="ri-stack-line"
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        
        <KpiCard
          title="Low Stock Items"
          value={lowStock?.length || 0}
          icon="ri-error-warning-line"
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          subtitle="Needs Attention"
        />
        
        <KpiCard
          title="Pending Orders"
          value={16}
          icon="ri-shopping-cart-line"
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
          subtitle="3 Due Today"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <i className="ri-line-chart-line text-green-500 mr-2"></i>
              Sales Trend (Last 30 Days)
            </h3>
            <div>
              <button className="text-sm text-gray-600 hover:text-primary-600 focus:outline-none">
                <i className="ri-more-2-fill"></i>
              </button>
            </div>
          </div>
          <SalesChart />
        </div>

        {/* Inventory Status Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <i className="ri-pie-chart-line text-purple-500 mr-2"></i>
              Stock Status by Category
            </h3>
            <div>
              <button className="text-sm text-gray-600 hover:text-primary-600 focus:outline-none">
                <i className="ri-more-2-fill"></i>
              </button>
            </div>
          </div>
          <InventoryStatusChart />
        </div>
      </div>

      {/* AI-Based Demand Forecasting Section */}
      <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
        <AIForecastingSection />
      </div>

      {/* Low Stock Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlerts />
        <RecentActivity />
      </div>

      {/* Inventory Summary */}
      <InventoryTable />
    </div>
  );
}
