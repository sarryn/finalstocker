import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface TopNavProps {
  onMenuClick: () => void;
}

const pathToTitle: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/scanner": "Scan Items",
  "/suppliers": "Suppliers",
  "/locations": "Locations",
  "/taxes": "GST & Taxes",
  "/price-management": "Price Management",
  "/payment-tracker": "Payment Tracker",
  "/settings": "Settings"
};

export default function TopNav({ onMenuClick }: TopNavProps) {
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState("Dashboard");

  useEffect(() => {
    setCurrentPage(pathToTitle[location] || "Not Found");
  }, [location]);

  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="text-gray-600"
            onClick={onMenuClick}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          <h1 className="ml-3 text-xl font-bold text-primary-800">InvSync</h1>
        </div>
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold text-gray-800">{currentPage}</h2>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <button type="button" className="text-gray-600 hover:text-gray-900">
              <i className="ri-notification-3-line text-xl"></i>
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          <div className="md:hidden">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-800">RK</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
