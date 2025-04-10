import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Filter, FileUp, FileDown } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";

interface Product {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  sellingPrice: number;
  purchasePrice: number;
  gstRate: number;
  minStockLevel: number;
  isActive: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface Inventory {
  id: number;
  productId: number;
  locationId: number;
  quantity: number;
}

interface Location {
  id: number;
  name: string;
}

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ['/api/inventory'],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['/api/locations'],
  });

  const isLoading = productsLoading || categoriesLoading || inventoryLoading || locationsLoading;

  // Get product details with inventory info
  const getInventoryItems = () => {
    if (isLoading || !products || !inventory || !categories || !locations) {
      return [];
    }

    return products.map((product: Product) => {
      // Find all inventory entries for this product
      const productInventory = inventory.filter((inv: Inventory) => inv.productId === product.id);
      
      // Calculate total quantities and filter by selected location if needed
      const filteredInventory = selectedLocation === "all"
        ? productInventory
        : productInventory.filter((inv: Inventory) => inv.locationId === parseInt(selectedLocation));
      
      const totalQuantity = filteredInventory.reduce((sum: number, inv: Inventory) => sum + inv.quantity, 0);
      const totalValue = totalQuantity * product.sellingPrice;
      
      const category = categories.find((cat: Category) => cat.id === product.categoryId);
      const inventoryLocations = productInventory.map((inv: Inventory) => {
        const location = locations.find((loc: Location) => loc.id === inv.locationId);
        return {
          locationId: inv.locationId,
          locationName: location ? location.name : "Unknown",
          quantity: inv.quantity
        };
      });
      
      return {
        ...product,
        quantity: totalQuantity,
        value: totalValue,
        category: category?.name || "Uncategorized",
        locations: inventoryLocations
      };
    });
  };

  const inventoryItems = getInventoryItems();

  // Handle filtering
  const filteredItems = inventoryItems.filter((item: any) => {
    // Filter by search term
    const matchesSearch = search === "" || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "all" || 
      (item.categoryId === parseInt(selectedCategory));
    
    // Filter by stock status
    const hasStock = item.quantity > 0;
    
    return matchesSearch && matchesCategory && hasStock;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Get icon for product
  const getProductIcon = (productName: string) => {
    if (productName.toLowerCase().includes("tv")) {
      return "ri-tv-line";
    } else if (productName.toLowerCase().includes("phone") || productName.toLowerCase().includes("galaxy")) {
      return "ri-smartphone-line";
    } else if (productName.toLowerCase().includes("shirt") || productName.toLowerCase().includes("t-shirt")) {
      return "ri-shirt-line";
    } else if (productName.toLowerCase().includes("headphone")) {
      return "ri-headphone-line";
    } else if (productName.toLowerCase().includes("mouse")) {
      return "ri-mouse-line";
    } else {
      return "ri-box-3-line";
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

  // Get category badge color
  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "electronics":
        return "bg-blue-100 text-blue-800";
      case "clothing":
        return "bg-green-100 text-green-800";
      case "home goods":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get stock status
  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity <= 0) return "bg-red-100 text-red-800";
    if (quantity <= minLevel * 0.3) return "bg-red-100 text-red-800";
    if (quantity <= minLevel) return "bg-amber-100 text-amber-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Inventory Management" 
        subtitle="Manage your product stock across all locations"
        actions={
          <>
            <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
              <FileDown className="w-4 h-4 mr-1" /> Export
            </button>
          </>
        }
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {locations?.map((location: Location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center md:w-auto">
            <Filter className="w-4 h-4 mr-1" /> More Filters
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : paginatedItems.length > 0 ? (
                paginatedItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                          <i className={`${getProductIcon(item.name)} text-gray-500`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            GST: {item.gstRate}% | Min Level: {item.minStockLevel}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadgeColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatus(item.quantity, item.minStockLevel)}`}>
                        {item.quantity} in stock
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.locations.map((loc: any) => (
                          <div key={loc.locationId}>{loc.locationName}: {loc.quantity}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(item.sellingPrice)}</div>
                      <div className="text-xs text-gray-500">Cost: {formatCurrency(item.purchasePrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-primary-600 hover:text-primary-900" title="Edit">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button className="text-amber-600 hover:text-amber-900" title="Restock">
                          <i className="ri-arrow-up-circle-line"></i>
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="More options">
                          <i className="ri-more-2-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <i className="ri-inbox-line text-4xl text-gray-300 mb-2"></i>
                      <p>No products found matching your criteria</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {!isLoading && filteredItems.length > 0 && (
              <>
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</span> of{" "}
                <span className="font-medium">{filteredItems.length}</span> products
              </>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex space-x-1">
              <button 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                const isCurrentPage = pageNum === currentPage;
                return (
                  <button 
                    key={i}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
                      isCurrentPage ? "bg-primary-50 text-primary-700 font-medium" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
