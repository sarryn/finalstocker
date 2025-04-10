import {
  users, type User, type InsertUser,
  locations, type Location, type InsertLocation,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  inventory, type Inventory, type InsertInventory,
  suppliers, type Supplier, type InsertSupplier,
  transactions, type Transaction, type InsertTransaction,
  transactionItems, type TransactionItem, type InsertTransactionItem,
  payments, type Payment, type InsertPayment,
  activityLogs, type ActivityLog, type InsertActivityLog
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location operations
  getLocations(): Promise<Location[]>;
  getLocation(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Inventory operations
  getInventory(): Promise<Inventory[]>;
  getInventoryByLocation(locationId: number): Promise<Inventory[]>;
  getInventoryByProduct(productId: number): Promise<Inventory[]>;
  getInventoryItem(productId: number, locationId: number): Promise<Inventory | undefined>;
  createInventory(inventory: InsertInventory): Promise<Inventory>;
  updateInventory(id: number, inventory: Partial<InsertInventory>): Promise<Inventory | undefined>;
  
  // Supplier operations
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  
  // Transaction operations
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  
  // Transaction item operations
  getTransactionItems(transactionId: number): Promise<TransactionItem[]>;
  createTransactionItem(transactionItem: InsertTransactionItem): Promise<TransactionItem>;
  
  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPaymentsByTransaction(transactionId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  
  // Activity log operations
  getActivityLogs(): Promise<ActivityLog[]>;
  createActivityLog(activityLog: InsertActivityLog): Promise<ActivityLog>;
  
  // Analytics operations
  getLowStockItems(): Promise<{ product: Product; inventory: Inventory }[]>;
  getInventoryValueByLocation(locationId?: number): Promise<number>;
  getInventoryCountByLocation(locationId?: number): Promise<number>;
  getRecentActivity(limit?: number): Promise<ActivityLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private locations: Map<number, Location>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private inventory: Map<number, Inventory>;
  private suppliers: Map<number, Supplier>;
  private transactions: Map<number, Transaction>;
  private transactionItems: Map<number, TransactionItem>;
  private payments: Map<number, Payment>;
  private activityLogs: Map<number, ActivityLog>;

  // Auto-incrementing IDs
  private userId: number;
  private locationId: number;
  private categoryId: number;
  private productId: number;
  private inventoryId: number;
  private supplierId: number;
  private transactionId: number;
  private transactionItemId: number;
  private paymentId: number;
  private activityLogId: number;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.inventory = new Map();
    this.suppliers = new Map();
    this.transactions = new Map();
    this.transactionItems = new Map();
    this.payments = new Map();
    this.activityLogs = new Map();

    this.userId = 1;
    this.locationId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.inventoryId = 1;
    this.supplierId = 1;
    this.transactionId = 1;
    this.transactionItemId = 1;
    this.paymentId = 1;
    this.activityLogId = 1;

    // Add some initial data
    this.initializeData();
  }

  private initializeData() {
    // Add default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "Administrator",
      role: "admin"
    });

    // Add default locations
    const mumbai = this.createLocation({
      name: "Mumbai Store",
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isActive: true
    });

    const delhi = this.createLocation({
      name: "Delhi Store",
      address: "456 Market Road",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      isActive: true
    });

    const bangalore = this.createLocation({
      name: "Bangalore Store",
      address: "789 Tech Park",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      isActive: true
    });

    // Add default categories
    const electronics = this.createCategory({
      name: "Electronics",
      description: "Electronic devices and accessories"
    });

    const clothing = this.createCategory({
      name: "Clothing",
      description: "Apparel and fashion items"
    });

    const homeGoods = this.createCategory({
      name: "Home Goods",
      description: "Items for home and living"
    });

    // Add default products
    const samsungTv = this.createProduct({
      name: "Samsung 43\" Smart TV",
      sku: "SM-TV43-4K",
      description: "43-inch 4K Smart LED TV",
      categoryId: electronics.id,
      purchasePrice: 32000,
      sellingPrice: 36999,
      gstRate: 18,
      hsn: "8528",
      minStockLevel: 5,
      isActive: true
    });

    const iphone = this.createProduct({
      name: "iPhone 13 (128GB)",
      sku: "IP-13-128-BLK",
      description: "Apple iPhone 13 with 128GB storage",
      categoryId: electronics.id,
      purchasePrice: 65000,
      sellingPrice: 79900,
      gstRate: 18,
      hsn: "8517",
      minStockLevel: 8,
      isActive: true
    });

    const cottonShirt = this.createProduct({
      name: "Men's Cotton Shirt",
      sku: "MCS-BLU-L",
      description: "Blue cotton formal shirt for men",
      categoryId: clothing.id,
      purchasePrice: 800,
      sellingPrice: 1299,
      gstRate: 5,
      hsn: "6205",
      minStockLevel: 20,
      isActive: true
    });

    const wirelessMouse = this.createProduct({
      name: "Wireless Mouse",
      sku: "WM-BLK-001",
      description: "Bluetooth wireless mouse",
      categoryId: electronics.id,
      purchasePrice: 600,
      sellingPrice: 899,
      gstRate: 18,
      hsn: "8471",
      minStockLevel: 10,
      isActive: true
    });

    const bluetoothHeadphones = this.createProduct({
      name: "Bluetooth Headphones",
      sku: "BH-RED-003",
      description: "Wireless Bluetooth headphones",
      categoryId: electronics.id,
      purchasePrice: 1000,
      sellingPrice: 1499,
      gstRate: 18,
      hsn: "8518",
      minStockLevel: 8,
      isActive: true
    });

    const samsungGalaxy = this.createProduct({
      name: "Samsung Galaxy A52",
      sku: "SM-A52-BLK",
      description: "Samsung Galaxy A52 smartphone",
      categoryId: electronics.id,
      purchasePrice: 22000,
      sellingPrice: 25999,
      gstRate: 18,
      hsn: "8517",
      minStockLevel: 10,
      isActive: true
    });

    const cottonTshirt = this.createProduct({
      name: "Cotton T-Shirt (XL)",
      sku: "CT-XL-WHT",
      description: "White cotton t-shirt in XL size",
      categoryId: clothing.id,
      purchasePrice: 300,
      sellingPrice: 599,
      gstRate: 5,
      hsn: "6109",
      minStockLevel: 15,
      isActive: true
    });

    const wirelessHeadphones = this.createProduct({
      name: "Wireless Headphones",
      sku: "WH-BT-BLK",
      description: "Wireless over-ear headphones",
      categoryId: electronics.id,
      purchasePrice: 1800,
      sellingPrice: 2499,
      gstRate: 18,
      hsn: "8518",
      minStockLevel: 8,
      isActive: true
    });

    // Add default inventory
    this.createInventory({
      productId: samsungTv.id,
      locationId: mumbai.id,
      quantity: 12
    });

    this.createInventory({
      productId: iphone.id,
      locationId: mumbai.id,
      quantity: 15
    });

    this.createInventory({
      productId: cottonShirt.id,
      locationId: mumbai.id,
      quantity: 45
    });

    this.createInventory({
      productId: samsungGalaxy.id,
      locationId: mumbai.id,
      quantity: 3
    });

    this.createInventory({
      productId: cottonTshirt.id,
      locationId: mumbai.id,
      quantity: 8
    });

    this.createInventory({
      productId: wirelessHeadphones.id,
      locationId: mumbai.id,
      quantity: 2
    });

    // Add inventory for Delhi store
    this.createInventory({
      productId: samsungTv.id,
      locationId: delhi.id,
      quantity: 8
    });

    this.createInventory({
      productId: iphone.id,
      locationId: delhi.id,
      quantity: 10
    });

    // Add inventory for Bangalore store
    this.createInventory({
      productId: cottonShirt.id,
      locationId: bangalore.id,
      quantity: 25
    });

    // Add default suppliers
    this.createSupplier({
      name: "Electro Supplies Ltd.",
      contactPerson: "Amit Sharma",
      email: "amit@electrosupplies.com",
      phone: "9876543210",
      address: "Plot 45, Industrial Area, Mumbai",
      gstIn: "27AABCS1429B1Z1",
      isActive: true
    });

    this.createSupplier({
      name: "Fashion Wholesale Co.",
      contactPerson: "Priya Patel",
      email: "priya@fashionwholesale.com",
      phone: "8765432109",
      address: "22 Commercial Street, Delhi",
      gstIn: "07AADCS2941C1Z2",
      isActive: true
    });

    // Add some recent activity logs
    this.createActivityLog({
      userId: 1,
      action: "STOCK_RECEIVED",
      entity: "product",
      entityId: 3,
      details: { quantity: 24, productName: "LED Bulbs" }
    });

    this.createActivityLog({
      userId: 1,
      action: "PRICE_UPDATE",
      entity: "product",
      entityId: 1,
      details: { oldPrice: 35999, newPrice: 36999, productName: "Samsung TVs" }
    });

    this.createActivityLog({
      userId: 1,
      action: "ORDER_PLACED",
      entity: "supplier",
      entityId: 1,
      details: { poNumber: "23457", supplierName: "Electro Supplies Ltd." }
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Location operations
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.locationId++;
    const now = new Date();
    const location: Location = { ...insertLocation, id, createdAt: now };
    this.locations.set(id, location);
    return location;
  }

  async updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined> {
    const existingLocation = this.locations.get(id);
    if (!existingLocation) return undefined;
    
    const updatedLocation = { ...existingLocation, ...location };
    this.locations.set(id, updatedLocation);
    return updatedLocation;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const now = new Date();
    const category: Category = { ...insertCategory, id, createdAt: now };
    this.categories.set(id, category);
    return category;
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.sku === sku,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const now = new Date();
    const updatedProduct = { 
      ...existingProduct, 
      ...product,
      updatedAt: now
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  // Inventory operations
  async getInventory(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryByLocation(locationId: number): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(
      (inv) => inv.locationId === locationId,
    );
  }

  async getInventoryByProduct(productId: number): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(
      (inv) => inv.productId === productId,
    );
  }

  async getInventoryItem(productId: number, locationId: number): Promise<Inventory | undefined> {
    return Array.from(this.inventory.values()).find(
      (inv) => inv.productId === productId && inv.locationId === locationId,
    );
  }

  async createInventory(insertInventory: InsertInventory): Promise<Inventory> {
    const id = this.inventoryId++;
    const now = new Date();
    const inventory: Inventory = { ...insertInventory, id, updatedAt: now };
    this.inventory.set(id, inventory);
    return inventory;
  }

  async updateInventory(id: number, inventory: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const existingInventory = this.inventory.get(id);
    if (!existingInventory) return undefined;
    
    const now = new Date();
    const updatedInventory = { 
      ...existingInventory, 
      ...inventory,
      updatedAt: now
    };
    this.inventory.set(id, updatedInventory);
    return updatedInventory;
  }
  
  // Supplier operations
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierId++;
    const now = new Date();
    const supplier: Supplier = { ...insertSupplier, id, createdAt: now };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existingSupplier = this.suppliers.get(id);
    if (!existingSupplier) return undefined;
    
    const updatedSupplier = { ...existingSupplier, ...supplier };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }
  
  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const now = new Date();
    const transaction: Transaction = { ...insertTransaction, id, createdAt: now };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existingTransaction = this.transactions.get(id);
    if (!existingTransaction) return undefined;
    
    const updatedTransaction = { ...existingTransaction, ...transaction };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // Transaction item operations
  async getTransactionItems(transactionId: number): Promise<TransactionItem[]> {
    return Array.from(this.transactionItems.values()).filter(
      (item) => item.transactionId === transactionId,
    );
  }

  async createTransactionItem(insertTransactionItem: InsertTransactionItem): Promise<TransactionItem> {
    const id = this.transactionItemId++;
    const transactionItem: TransactionItem = { ...insertTransactionItem, id };
    this.transactionItems.set(id, transactionItem);
    return transactionItem;
  }
  
  // Payment operations
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getPaymentsByTransaction(transactionId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.transactionId === transactionId,
    );
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.paymentId++;
    const now = new Date();
    const payment: Payment = { ...insertPayment, id, createdAt: now };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
    const existingPayment = this.payments.get(id);
    if (!existingPayment) return undefined;
    
    const updatedPayment = { ...existingPayment, ...payment };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  
  // Activity log operations
  async getActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async createActivityLog(insertActivityLog: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogId++;
    const now = new Date();
    const activityLog: ActivityLog = { ...insertActivityLog, id, timestamp: now };
    this.activityLogs.set(id, activityLog);
    return activityLog;
  }
  
  // Analytics operations
  async getLowStockItems(): Promise<{ product: Product; inventory: Inventory }[]> {
    const inventoryList = Array.from(this.inventory.values());
    const result: { product: Product; inventory: Inventory }[] = [];
    
    for (const inv of inventoryList) {
      const product = this.products.get(inv.productId);
      if (product && inv.quantity <= product.minStockLevel) {
        result.push({ product, inventory: inv });
      }
    }
    
    return result;
  }

  async getInventoryValueByLocation(locationId?: number): Promise<number> {
    const inventoryList = locationId 
      ? Array.from(this.inventory.values()).filter(inv => inv.locationId === locationId)
      : Array.from(this.inventory.values());
    
    let totalValue = 0;
    for (const inv of inventoryList) {
      const product = this.products.get(inv.productId);
      if (product) {
        totalValue += product.sellingPrice * inv.quantity;
      }
    }
    
    return totalValue;
  }

  async getInventoryCountByLocation(locationId?: number): Promise<number> {
    const inventoryList = locationId 
      ? Array.from(this.inventory.values()).filter(inv => inv.locationId === locationId)
      : Array.from(this.inventory.values());
    
    let totalCount = 0;
    for (const inv of inventoryList) {
      totalCount += inv.quantity;
    }
    
    return totalCount;
  }

  async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
