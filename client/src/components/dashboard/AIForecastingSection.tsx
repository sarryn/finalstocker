import { useState } from 'react';
import { Brain, Zap, TrendingUp, BarChart3, Info, Layers, BoxSelect, Calendar } from 'lucide-react';

interface ForecastItem {
  productId: number;
  productName: string;
  currentStock: number;
  projectedDemand: number;
  confidence: number;
  suggestion: string;
}

export default function AIForecastingSection() {
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | '90days'>('30days');
  const [category, setCategory] = useState<string>('all');
  
  // Mock AI-generated forecasts
  const forecasts: ForecastItem[] = [
    {
      productId: 1,
      productName: 'Rice (Basmati) 5kg',
      currentStock: 45,
      projectedDemand: 72,
      confidence: 0.92,
      suggestion: 'Order 30 units within 5 days to avoid stockout'
    },
    {
      productId: 2,
      productName: 'Cooking Oil 1L',
      currentStock: 28,
      projectedDemand: 50,
      confidence: 0.88,
      suggestion: 'Order 25 units immediately'
    },
    {
      productId: 3,
      productName: 'Wheat Flour 10kg',
      currentStock: 60,
      projectedDemand: 35,
      confidence: 0.78,
      suggestion: 'Current stock sufficient, no action needed'
    },
    {
      productId: 4,
      productName: 'Milk Powder 500g',
      currentStock: 12,
      projectedDemand: 38,
      confidence: 0.94,
      suggestion: 'Urgent: Order 30 units today to prevent stockout'
    },
    {
      productId: 5,
      productName: 'Sugar 1kg',
      currentStock: 48,
      projectedDemand: 40,
      confidence: 0.82,
      suggestion: 'Current stock sufficient, order in 2 weeks'
    }
  ];

  // Smart insights from AI
  const aiInsights = [
    "Based on upcoming festival season, demand for cooking essentials will increase by ~35%",
    "Supplier XYZ has been delayed in previous 3 deliveries - consider alternative source",
    "Price optimization opportunity detected for 'Rice (Basmati)' - current price below market average by 8%",
    "Demand pattern shifting for dairy products - consider adjusting automatic reorder levels",
    "Seasonal demand for cold beverages declining - reduce procurement over next 6 weeks"
  ];

  // AI tips specific to inventory management
  const aiTips = [
    {
      title: "Stock Level Optimization",
      description: "The system has identified optimal stock levels based on your sales velocity, storage costs, and lead times. Implement the suggested changes to reduce holding costs by up to 15%.",
      icon: <Layers className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Trend Prediction",
      description: "Based on market data and your sales history, we've identified emerging product trends. Consider adjusting your inventory to accommodate growing demand in eco-friendly packaging items.",
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Seasonal Planning",
      description: "Upcoming monsoon season will impact delivery times in your region. Consider placing orders 5-7 days earlier than usual to maintain stock levels.",
      icon: <Calendar className="h-8 w-8 text-green-500" />
    },
    {
      title: "Category Analysis",
      description: "Your 'Home Essentials' category has shown consistent growth with 22% higher margins than other categories. Consider expanding selection in this category.",
      icon: <BoxSelect className="h-8 w-8 text-amber-500" />
    }
  ];

  const getStatusColor = (currentStock: number, projectedDemand: number) => {
    const ratio = currentStock / projectedDemand;
    if (ratio < 0.5) return "text-red-600";
    if (ratio < 0.8) return "text-amber-600";
    return "text-green-600";
  };

  const formatConfidence = (confidence: number) => {
    return (confidence * 100).toFixed(0) + "%";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Brain className="mr-2 h-6 w-6 text-blue-600" />
          AI Demand Forecasting & Insights
        </h2>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
          >
            <option value="7days">Next 7 Days</option>
            <option value="30days">Next 30 Days</option>
            <option value="90days">Next 90 Days</option>
          </select>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="grocery">Grocery</option>
            <option value="dairy">Dairy</option>
            <option value="beverages">Beverages</option>
            <option value="household">Household</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: AI Demand Forecast */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Demand Forecast ({timeframe === '7days' ? 'Next 7 Days' : timeframe === '30days' ? 'Next 30 Days' : 'Next Quarter'})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projected Demand
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Confidence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Suggestion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forecasts.map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.currentStock} units
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(item.currentStock, item.projectedDemand)}`}>
                      {item.projectedDemand} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative w-24 h-2 bg-gray-200 rounded">
                          <div 
                            className={`absolute top-0 left-0 h-2 rounded ${item.confidence > 0.9 ? 'bg-green-500' : item.confidence > 0.7 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${item.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700">{formatConfidence(item.confidence)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.suggestion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-blue-50 border-t border-blue-100 rounded-b-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                AI forecasts are based on your historical sales data, seasonal trends, and market conditions. The system continuously learns from new data to improve prediction accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Right column: AI Insights & Tips */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-amber-500" />
                Smart Insights
              </h3>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                      <Zap className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow border border-blue-100">
            <div className="p-4 border-b border-blue-200">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <Brain className="mr-2 h-5 w-5 text-indigo-600" />
                AI-Powered Recommendations
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {aiTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{tip.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-indigo-100 bg-opacity-50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-indigo-700">Next AI analysis update in: 6 hours</p>
                <button className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200">
                  Run Analysis Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}