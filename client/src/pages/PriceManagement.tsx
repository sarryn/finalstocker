import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Percent, Save } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface Product {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  purchasePrice: number;
  sellingPrice: number;
  gstRate: number;
}

interface Category {
  id: number;
  name: string;
}

export default function PriceManagement() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editMode, setEditMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [priceChanges, setPriceChanges] = useState<Record<number, number>>({});
  const [bulkUpdatePercentage, setBulkUpdatePercentage] = useState(5);
  const [bulkUpdateType, setBulkUpdateType] = useState<'increase' | 'decrease'>('increase');
  
  const { toast } = useToast();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  const isLoading = productsLoading || categoriesLoading;

  // Filter products based on search and category
  const filteredProducts = !isLoading && products && categories
    ? products.filter((product: Product) => {
        const matchesSearch = search === "" || 
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.sku.toLowerCase().includes(search.toLowerCase());
        
        const matchesCategory = selectedCategory === "all" || 
          product.categoryId === parseInt(selectedCategory);
        
        return matchesSearch && matchesCategory;
      })
    : [];

  // Format as Indian Rupees
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handle price change for a specific product
  const handlePriceChange = (productId: number, newPrice: number) => {
    setPriceChanges(prev => ({
      ...prev,
      [productId]: newPrice
    }));
  };

  // Handle product selection for bulk operations
  const handleProductSelection = (productId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  // Toggle selection of all products
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts(filteredProducts.map((p: Product) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Apply bulk price update to selected products
  const applyBulkUpdate = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product to update",
        variant: "destructive"
      });
      return;
    }

    const updatedPrices = { ...priceChanges };
    
    selectedProducts.forEach(productId => {
      const product = products.find((p: Product) => p.id === productId);
      if (product) {
        const currentPrice = product.sellingPrice;
        const changeAmount = currentPrice * (bulkUpdatePercentage / 100);
        const newPrice = bulkUpdateType === 'increase' 
          ? currentPrice + changeAmount 
          : currentPrice - changeAmount;
        
        updatedPrices[productId] = Math.round(newPrice);
      }
    });
    
    setPriceChanges(updatedPrices);
    
    toast({
      title: "Bulk update applied",
      description: `Updated prices for ${selectedProducts.length} products`,
    });
  };

  // Save price changes to the server
  const saveChanges = async () => {
    if (Object.keys(priceChanges).length === 0) {
      toast({
        title: "No changes to save",
        description: "Please make price changes first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      for (const [productIdStr, newPrice] of Object.entries(priceChanges)) {
        const productId = parseInt(productIdStr);
        
        await apiRequest('PUT', `/api/products/${productId}`, {
          sellingPrice: newPrice
        });
      }
      
      // Reset state and refresh product data
      setPriceChanges({});
      setEditMode(false);
      setSelectedProducts([]);
      
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      toast({
        title: "Prices updated",
        description: `Successfully updated ${Object.keys(priceChanges).length} products`,
      });
    } catch (error) {
      console.error("Error updating prices:", error);
      toast({
        title: "Update failed",
        description: "Could not update product prices",
        variant: "destructive"
      });
    }
  };

  // Calculate profit margin
  const calculateMargin = (costPrice: number, sellingPrice: number) => {
    if (costPrice === 0) return 0;
    return ((sellingPrice - costPrice) / sellingPrice) * 100;
  };

  // Get category by ID
  const getCategoryName = (categoryId: number) => {
    if (!categories) return "Unknown";
    const category = categories.find((c: Category) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Price Management" 
        subtitle="Update product prices and manage profit margins"
        actions={
          !editMode ? (
            <button 
              className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
              onClick={() => setEditMode(true)}
            >
              <i className="ri-edit-line mr-1"></i> Edit Prices
            </button>
          ) : (
            <>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                onClick={saveChanges}
              >
                <Save className="w-4 h-4 mr-1" /> Save Changes
              </button>
              <button 
                className="px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
                onClick={() => {
                  setEditMode(false);
                  setPriceChanges({});
                  setSelectedProducts([]);
                }}
              >
                <i className="ri-close-line mr-1"></i> Cancel
              </button>
            </>
          )
        }
      />

      {/* Filters and Search */}
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
          
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center md:w-auto">
            <Filter className="w-4 h-4 mr-1" /> More Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions (only visible in edit mode) */}
      {editMode && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-md font-medium text-blue-800 mb-3">Bulk Price Update</h3>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedProducts.length === filteredProducts.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="selectAll" className="text-sm text-gray-700">
                Select All Products
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={bulkUpdateType}
                onChange={(e) => setBulkUpdateType(e.target.value as 'increase' | 'decrease')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="increase">Increase by</option>
                <option value="decrease">Decrease by</option>
              </select>
              
              <div className="relative w-24">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={bulkUpdatePercentage}
                  onChange={(e) => setBulkUpdatePercentage(Number(e.target.value))}
                  className="pl-3 pr-8 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
              
              <button
                onClick={applyBulkUpdate}
                className="px-3 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex items-center"
              >
                <Percent className="w-4 h-4 mr-1" /> Apply
              </button>
            </div>
            
            <div className="text-sm text-blue-700">
              {selectedProducts.length} products selected
            </div>
          </div>
        </div>
      )}

      {/* Product Price Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {editMode && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="sr-only">Select</span>
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margin
                </th>
                {editMode && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Price
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GST
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {editMode && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                    </td>
                    {editMode && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-12"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product: Product) => {
                  const currentSellingPrice = product.sellingPrice;
                  const newPrice = priceChanges[product.id] || currentSellingPrice;
                  const currentMargin = calculateMargin(product.purchasePrice, currentSellingPrice);
                  const newMargin = calculateMargin(product.purchasePrice, newPrice);
                  const priceChanged = newPrice !== currentSellingPrice;
                  
                  return (
                    <tr key={product.id} className={`hover:bg-gray-50 ${priceChanged ? 'bg-yellow-50' : ''}`}>
                      {editMode && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryName(product.categoryId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.purchasePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(currentSellingPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-block w-16 text-sm ${currentMargin < 15 ? 'text-red-600' : 'text-green-600'}`}>
                            {currentMargin.toFixed(1)}%
                          </span>
                          {priceChanged && (
                            <span className="ml-2 text-xs">
                              {newMargin > currentMargin ? (
                                <span className="text-green-600 flex items-center">
                                  <ArrowUpRight className="w-3 h-3 mr-1" />
                                  {(newMargin - currentMargin).toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-red-600 flex items-center">
                                  <ArrowDownRight className="w-3 h-3 mr-1" />
                                  {(currentMargin - newMargin).toFixed(1)}%
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </td>
                      {editMode && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={newPrice}
                            onChange={(e) => handlePriceChange(product.id, Number(e.target.value))}
                            className={`px-3 py-1 w-24 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${
                              priceChanged ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'
                            }`}
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.gstRate}%
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={editMode ? 8 : 7} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <i className="ri-price-tag-3-line text-4xl text-gray-300 mb-2"></i>
                      <p>No products found matching your criteria</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Management Tips */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Pricing Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Cost-Plus Pricing</h4>
            <p className="text-sm text-gray-600">Add a fixed percentage markup to your cost price. Ensures profitability but may not maximize revenue.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Competitive Pricing</h4>
            <p className="text-sm text-gray-600">Set prices based on market competition. Helps maintain market share but may reduce profit margins.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Value-Based Pricing</h4>
            <p className="text-sm text-gray-600">Price products based on perceived value to customers. Can maximize profits for premium products.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
