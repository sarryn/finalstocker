// Mock data for use in frontend development
// This file simulates the data that would normally come from the backend API

export const mockData = {
  // Categories
  categories: [
    { id: 1, name: "Electronics", description: "Electronic devices and accessories", createdAt: "2023-01-15T10:30:00Z" },
    { id: 2, name: "Clothing", description: "Apparel and fashion items", createdAt: "2023-01-15T10:35:00Z" },
    { id: 3, name: "Groceries", description: "Food and household items", createdAt: "2023-01-15T10:40:00Z" },
    { id: 4, name: "Furniture", description: "Home and office furniture", createdAt: "2023-01-15T10:45:00Z" },
    { id: 5, name: "Toys", description: "Children's toys and games", createdAt: "2023-01-15T10:50:00Z" },
  ],

  // Products
  products: [
    { 
      id: 1, 
      name: "Smartphone", 
      sku: "ELEC-SP-001", 
      description: "Latest model smartphone with high-end features", 
      categoryId: 1, 
      purchasePrice: 15000, 
      sellingPrice: 20000, 
      gstRate: 18,
      createdAt: "2023-01-20T09:00:00Z",
      imageUrl: null
    },
    { 
      id: 2, 
      name: "Laptop", 
      sku: "ELEC-LP-002", 
      description: "Powerful laptop for business and gaming", 
      categoryId: 1, 
      purchasePrice: 45000, 
      sellingPrice: 60000, 
      gstRate: 18,
      createdAt: "2023-01-20T09:15:00Z",
      imageUrl: null
    },
    { 
      id: 3, 
      name: "T-shirt", 
      sku: "CLOTH-TS-001", 
      description: "Cotton t-shirt, available in multiple colors", 
      categoryId: 2, 
      purchasePrice: 300, 
      sellingPrice: 600, 
      gstRate: 5,
      createdAt: "2023-01-20T09:30:00Z",
      imageUrl: null
    },
    { 
      id: 4, 
      name: "Jeans", 
      sku: "CLOTH-JN-002", 
      description: "Denim jeans, regular fit", 
      categoryId: 2, 
      purchasePrice: 700, 
      sellingPrice: 1400, 
      gstRate: 5,
      createdAt: "2023-01-20T09:45:00Z",
      imageUrl: null
    },
    { 
      id: 5, 
      name: "Rice (5kg)", 
      sku: "GROC-RC-001", 
      description: "Premium basmati rice", 
      categoryId: 3, 
      purchasePrice: 300, 
      sellingPrice: 450, 
      gstRate: 0,
      createdAt: "2023-01-20T10:00:00Z",
      imageUrl: null
    },
    { 
      id: 6, 
      name: "Cooking Oil (1L)", 
      sku: "GROC-OIL-002", 
      description: "Refined sunflower oil", 
      categoryId: 3, 
      purchasePrice: 120, 
      sellingPrice: 180, 
      gstRate: 5,
      createdAt: "2023-01-20T10:15:00Z",
      imageUrl: null
    },
    { 
      id: 7, 
      name: "Office Chair", 
      sku: "FURN-CHR-001", 
      description: "Ergonomic office chair with adjustable height", 
      categoryId: 4, 
      purchasePrice: 3000, 
      sellingPrice: 5000, 
      gstRate: 18,
      createdAt: "2023-01-20T10:30:00Z",
      imageUrl: null
    },
    { 
      id: 8, 
      name: "Wooden Table", 
      sku: "FURN-TBL-002", 
      description: "Solid wood dining table", 
      categoryId: 4, 
      purchasePrice: 8000, 
      sellingPrice: 12000, 
      gstRate: 18,
      createdAt: "2023-01-20T10:45:00Z",
      imageUrl: null
    },
    { 
      id: 9, 
      name: "Building Blocks", 
      sku: "TOY-BLK-001", 
      description: "Educational building blocks for children", 
      categoryId: 5, 
      purchasePrice: 500, 
      sellingPrice: 900, 
      gstRate: 12,
      createdAt: "2023-01-20T11:00:00Z",
      imageUrl: null
    },
    { 
      id: 10, 
      name: "Remote Car", 
      sku: "TOY-CAR-002", 
      description: "Battery operated remote control car", 
      categoryId: 5, 
      purchasePrice: 700, 
      sellingPrice: 1200, 
      gstRate: 12,
      createdAt: "2023-01-20T11:15:00Z",
      imageUrl: null
    },
  ],

  // Locations
  locations: [
    { id: 1, name: "Main Store", address: "123 Main Street, Mumbai, Maharashtra", phoneNumber: "9876543210", createdAt: "2023-01-10T08:00:00Z" },
    { id: 2, name: "Warehouse", address: "456 Industrial Area, Delhi, Delhi", phoneNumber: "9876543211", createdAt: "2023-01-10T08:30:00Z" },
    { id: 3, name: "Branch Store - North", address: "789 North Avenue, Bangalore, Karnataka", phoneNumber: "9876543212", createdAt: "2023-01-10T09:00:00Z" },
    { id: 4, name: "Branch Store - South", address: "101 South Road, Chennai, Tamil Nadu", phoneNumber: "9876543213", createdAt: "2023-01-10T09:30:00Z" },
  ],

  // Inventory
  inventory: [
    { id: 1, productId: 1, locationId: 1, quantity: 25, minQuantity: 5, maxQuantity: 50, updatedAt: "2023-02-01T10:00:00Z" },
    { id: 2, productId: 2, locationId: 1, quantity: 10, minQuantity: 3, maxQuantity: 20, updatedAt: "2023-02-01T10:05:00Z" },
    { id: 3, productId: 3, locationId: 1, quantity: 100, minQuantity: 20, maxQuantity: 200, updatedAt: "2023-02-01T10:10:00Z" },
    { id: 4, productId: 4, locationId: 1, quantity: 80, minQuantity: 15, maxQuantity: 150, updatedAt: "2023-02-01T10:15:00Z" },
    { id: 5, productId: 5, locationId: 1, quantity: 50, minQuantity: 10, maxQuantity: 100, updatedAt: "2023-02-01T10:20:00Z" },
    { id: 6, productId: 1, locationId: 2, quantity: 50, minQuantity: 10, maxQuantity: 100, updatedAt: "2023-02-01T10:25:00Z" },
    { id: 7, productId: 2, locationId: 2, quantity: 20, minQuantity: 5, maxQuantity: 40, updatedAt: "2023-02-01T10:30:00Z" },
    { id: 8, productId: 6, locationId: 1, quantity: 120, minQuantity: 30, maxQuantity: 200, updatedAt: "2023-02-01T10:35:00Z" },
    { id: 9, productId: 7, locationId: 1, quantity: 15, minQuantity: 5, maxQuantity: 30, updatedAt: "2023-02-01T10:40:00Z" },
    { id: 10, productId: 8, locationId: 1, quantity: 10, minQuantity: 2, maxQuantity: 20, updatedAt: "2023-02-01T10:45:00Z" },
    { id: 11, productId: 9, locationId: 1, quantity: 30, minQuantity: 10, maxQuantity: 60, updatedAt: "2023-02-01T10:50:00Z" },
    { id: 12, productId: 10, locationId: 1, quantity: 20, minQuantity: 5, maxQuantity: 40, updatedAt: "2023-02-01T10:55:00Z" },
    { id: 13, productId: 3, locationId: 2, quantity: 200, minQuantity: 50, maxQuantity: 400, updatedAt: "2023-02-01T11:00:00Z" },
    { id: 14, productId: 4, locationId: 2, quantity: 150, minQuantity: 30, maxQuantity: 300, updatedAt: "2023-02-01T11:05:00Z" },
    { id: 15, productId: 5, locationId: 2, quantity: 100, minQuantity: 20, maxQuantity: 200, updatedAt: "2023-02-01T11:10:00Z" },
    { id: 16, productId: 6, locationId: 2, quantity: 2, minQuantity: 30, maxQuantity: 200, updatedAt: "2023-02-01T11:15:00Z" },
  ],

  // Suppliers
  suppliers: [
    { 
      id: 1, 
      name: "Tech Distributors", 
      contactName: "Amit Sharma", 
      email: "amit@techdist.com", 
      phoneNumber: "9876543001", 
      address: "123 Tech Park, Mumbai, Maharashtra", 
      createdAt: "2023-01-05T09:00:00Z",
      gstNumber: "27AABCS1429B1Z1"
    },
    { 
      id: 2, 
      name: "Fashion Wholesale", 
      contactName: "Priya Patel", 
      email: "priya@fashionws.com", 
      phoneNumber: "9876543002", 
      address: "456 Textile Market, Surat, Gujarat", 
      createdAt: "2023-01-05T09:30:00Z",
      gstNumber: "24AADCF2246M1Z3"
    },
    { 
      id: 3, 
      name: "Food Supplies Co.", 
      contactName: "Raj Kumar", 
      email: "raj@foodsupplies.com", 
      phoneNumber: "9876543003", 
      address: "789 APMC Market, Pune, Maharashtra", 
      createdAt: "2023-01-05T10:00:00Z",
      gstNumber: "27AALFA2346C1Z9"
    },
    { 
      id: 4, 
      name: "Home Furniture Ltd.", 
      contactName: "Sanjay Singh", 
      email: "sanjay@homefurniture.com", 
      phoneNumber: "9876543004", 
      address: "101 Industrial Area, Delhi, Delhi", 
      createdAt: "2023-01-05T10:30:00Z",
      gstNumber: "07AAACH7409R1ZP"
    },
    { 
      id: 5, 
      name: "Kids World Toys", 
      contactName: "Meera Joshi", 
      email: "meera@kidsworld.com", 
      phoneNumber: "9876543005", 
      address: "202 Commercial Complex, Ahmedabad, Gujarat", 
      createdAt: "2023-01-05T11:00:00Z",
      gstNumber: "24AAECK5768D1Z8"
    },
  ],

  // Transactions
  transactions: [
    { 
      id: 1, 
      type: "purchase", 
      date: "2023-02-10T10:00:00Z", 
      refNumber: "PO-2023-001", 
      supplierId: 1, 
      totalAmount: 225000, 
      gstAmount: 40500,
      status: "completed", 
      dueDate: "2023-03-10T10:00:00Z",
      createdAt: "2023-02-10T10:00:00Z" 
    },
    { 
      id: 2, 
      type: "purchase", 
      date: "2023-02-15T11:00:00Z", 
      refNumber: "PO-2023-002", 
      supplierId: 2, 
      totalAmount: 80000, 
      gstAmount: 4000,
      status: "completed", 
      dueDate: "2023-03-15T11:00:00Z",
      createdAt: "2023-02-15T11:00:00Z" 
    },
    { 
      id: 3, 
      type: "purchase", 
      date: "2023-02-20T09:00:00Z", 
      refNumber: "PO-2023-003", 
      supplierId: 3, 
      totalAmount: 42000, 
      gstAmount: 2100,
      status: "pending", 
      dueDate: "2023-03-20T09:00:00Z",
      createdAt: "2023-02-20T09:00:00Z" 
    },
    { 
      id: 4, 
      type: "sale", 
      date: "2023-02-25T14:00:00Z", 
      refNumber: "INV-2023-001", 
      totalAmount: 80000, 
      gstAmount: 14400,
      status: "completed", 
      createdAt: "2023-02-25T14:00:00Z" 
    },
    { 
      id: 5, 
      type: "sale", 
      date: "2023-02-28T15:30:00Z", 
      refNumber: "INV-2023-002", 
      totalAmount: 120000, 
      gstAmount: 21600,
      status: "completed", 
      createdAt: "2023-02-28T15:30:00Z" 
    },
    { 
      id: 6, 
      type: "sale", 
      date: "2023-03-05T10:15:00Z", 
      refNumber: "INV-2023-003", 
      totalAmount: 3000, 
      gstAmount: 150,
      status: "pending", 
      dueDate: "2023-04-05T10:15:00Z",
      createdAt: "2023-03-05T10:15:00Z" 
    },
    { 
      id: 7, 
      type: "purchase", 
      date: "2023-03-10T11:30:00Z", 
      refNumber: "PO-2023-004", 
      supplierId: 4, 
      totalAmount: 110000, 
      gstAmount: 19800,
      status: "pending", 
      dueDate: "2023-04-10T11:30:00Z",
      createdAt: "2023-03-10T11:30:00Z" 
    },
  ],

  // Payments
  payments: [
    { 
      id: 1, 
      transactionId: 1, 
      date: "2023-02-10T10:30:00Z", 
      amount: 225000, 
      method: "bank_transfer", 
      reference: "BT-20230210-001", 
      status: "completed",
      createdAt: "2023-02-10T10:30:00Z" 
    },
    { 
      id: 2, 
      transactionId: 2, 
      date: "2023-02-15T11:30:00Z", 
      amount: 80000, 
      method: "bank_transfer", 
      reference: "BT-20230215-001", 
      status: "completed",
      createdAt: "2023-02-15T11:30:00Z" 
    },
    { 
      id: 3, 
      transactionId: 4, 
      date: "2023-02-25T14:30:00Z", 
      amount: 80000, 
      method: "cash", 
      reference: "CSH-20230225-001", 
      status: "completed",
      createdAt: "2023-02-25T14:30:00Z" 
    },
    { 
      id: 4, 
      transactionId: 5, 
      date: "2023-02-28T16:00:00Z", 
      amount: 120000, 
      method: "upi", 
      reference: "UPI-20230228-001", 
      status: "completed",
      createdAt: "2023-02-28T16:00:00Z" 
    },
    { 
      id: 5, 
      transactionId: 3, 
      date: "2023-03-01T10:00:00Z", 
      amount: 20000, 
      method: "bank_transfer", 
      reference: "BT-20230301-001", 
      status: "completed",
      createdAt: "2023-03-01T10:00:00Z" 
    },
  ],

  // Activity Logs
  activityLogs: [
    { id: 1, userId: 1, action: "inventory_update", entityType: "inventory", entityId: 1, details: "Updated quantity of Smartphone from 20 to 25", timestamp: "2023-03-15T09:30:00Z" },
    { id: 2, userId: 1, action: "inventory_update", entityType: "inventory", entityId: 2, details: "Updated quantity of Laptop from 8 to 10", timestamp: "2023-03-15T09:45:00Z" },
    { id: 3, userId: 1, action: "product_create", entityType: "product", entityId: 11, details: "Added new product: Wireless Earbuds", timestamp: "2023-03-15T10:00:00Z" },
    { id: 4, userId: 1, action: "transaction_create", entityType: "transaction", entityId: 8, details: "Created new purchase order PO-2023-005", timestamp: "2023-03-15T10:30:00Z" },
    { id: 5, userId: 1, action: "payment_create", entityType: "payment", entityId: 6, details: "Recorded payment of ₹50,000 for PO-2023-004", timestamp: "2023-03-15T11:00:00Z" },
    { id: 6, userId: 1, action: "price_update", entityType: "product", entityId: 1, details: "Updated selling price of Smartphone from ₹18,000 to ₹20,000", timestamp: "2023-03-15T11:30:00Z" },
    { id: 7, userId: 1, action: "supplier_create", entityType: "supplier", entityId: 6, details: "Added new supplier: Electronics Mega Mart", timestamp: "2023-03-15T12:00:00Z" },
    { id: 8, userId: 1, action: "transaction_create", entityType: "transaction", entityId: 9, details: "Created new sales invoice INV-2023-004", timestamp: "2023-03-15T14:00:00Z" },
    { id: 9, userId: 1, action: "payment_create", entityType: "payment", entityId: 7, details: "Recorded payment of ₹25,000 for INV-2023-004", timestamp: "2023-03-15T14:30:00Z" },
    { id: 10, userId: 1, action: "inventory_update", entityType: "inventory", entityId: 5, details: "Updated minimum quantity of Rice (5kg) from 5 to 10", timestamp: "2023-03-15T15:00:00Z" },
  ],

  // Low stock items
  lowStockItems: [
    { 
      product: { 
        id: 6, 
        name: "Cooking Oil (1L)", 
        sku: "GROC-OIL-002", 
        categoryId: 3, 
        purchasePrice: 120, 
        sellingPrice: 180
      },
      inventory: { 
        id: 16, 
        productId: 6, 
        locationId: 2, 
        quantity: 2, 
        minQuantity: 30
      }
    },
    { 
      product: { 
        id: 2, 
        name: "Laptop", 
        sku: "ELEC-LP-002", 
        categoryId: 1, 
        purchasePrice: 45000, 
        sellingPrice: 60000
      },
      inventory: { 
        id: 2, 
        productId: 2, 
        locationId: 1, 
        quantity: 10, 
        minQuantity: 3
      }
    },
    { 
      product: { 
        id: 8, 
        name: "Wooden Table", 
        sku: "FURN-TBL-002", 
        categoryId: 4, 
        purchasePrice: 8000, 
        sellingPrice: 12000
      },
      inventory: { 
        id: 10, 
        productId: 8, 
        locationId: 1, 
        quantity: 10, 
        minQuantity: 2
      }
    },
  ]
};