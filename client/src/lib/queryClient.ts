import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockData } from "./mockData";

// Mock API request function that returns sample data instead of making actual API calls
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  console.log(`Mock API request: ${method} ${url}`, data);
  
  // Simulate successful response
  return {
    ok: true,
    json: () => Promise.resolve({ success: true }),
    status: 200,
    statusText: "OK"
  };
}

// Custom query function that uses mock data instead of making real API calls
export const getQueryFn: <T>(options: { 
  on401: "returnNull" | "throw";
}) => QueryFunction<T> = 
  () => 
  async ({ queryKey }) => {
    console.log(`Fetching mock data for query key: ${queryKey[0]}`);
    
    // Get the endpoint from the query key
    const endpoint = queryKey[0] as string;
    const id = queryKey.length > 1 ? queryKey[1] : null;
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return the appropriate mock data based on the endpoint
    if (endpoint.includes("products")) {
      return id ? mockData.products.find((p: any) => p.id === id) : mockData.products;
    } 
    else if (endpoint.includes("categories")) {
      return id ? mockData.categories.find((c: any) => c.id === id) : mockData.categories;
    }
    else if (endpoint.includes("inventory")) {
      return id ? mockData.inventory.find((i: any) => i.id === id) : mockData.inventory;
    }
    else if (endpoint.includes("suppliers")) {
      return id ? mockData.suppliers.find((s: any) => s.id === id) : mockData.suppliers;
    }
    else if (endpoint.includes("locations")) {
      return id ? mockData.locations.find((l: any) => l.id === id) : mockData.locations;
    }
    else if (endpoint.includes("transactions")) {
      return id ? mockData.transactions.find((t: any) => t.id === id) : mockData.transactions;
    }
    else if (endpoint.includes("payments")) {
      return id ? mockData.payments.find((p: any) => p.id === id) : mockData.payments;
    }
    else if (endpoint.includes("activity")) {
      return mockData.activityLogs;
    }
    else if (endpoint.includes("analytics/low-stock")) {
      return mockData.lowStockItems;
    }
    else if (endpoint.includes("analytics/inventory-value")) {
      return { value: 2850000 };
    }
    else if (endpoint.includes("analytics/inventory-count")) {
      return { count: 1254 };
    }
    
    // Default: return empty array
    return [];
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
