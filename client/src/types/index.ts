// Common types for use throughout the application

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  categoryId: number;
  purchasePrice: number;
  sellingPrice: number;
  gstRate: number;
  createdAt: string;
  imageUrl: string | null;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  createdAt: string;
}

export interface Inventory {
  id: number;
  productId: number;
  locationId: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  updatedAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gstNumber: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  type: 'purchase' | 'sale';
  date: string;
  refNumber: string;
  supplierId?: number;
  totalAmount: number;
  gstAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  dueDate?: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  transactionId: number;
  date: string;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'upi' | 'credit_card' | 'cheque';
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  details: string;
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LowStockItem {
  product: Product;
  inventory: Inventory;
}

export interface MockData {
  products: Product[];
  categories: Category[];
  locations: Location[];
  inventory: Inventory[];
  suppliers: Supplier[];
  transactions: Transaction[];
  payments: Payment[];
  activityLogs: ActivityLog[];
  lowStockItems: LowStockItem[];
}