import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  insertUserSchema,
  insertLocationSchema,
  insertCategorySchema,
  insertProductSchema,
  insertInventorySchema,
  insertSupplierSchema,
  insertTransactionSchema,
  insertTransactionItemSchema,
  insertPaymentSchema,
  insertActivityLogSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  const handleError = (err: any, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ error: validationError.message });
    }
    return res.status(500).json({ error: err.message || "Internal server error" });
  };

  // Locations API
  app.get("/api/locations", async (req: Request, res: Response) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/locations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const location = await storage.getLocation(id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/locations", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(validatedData);
      res.status(201).json(location);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.put("/api/locations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertLocationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(id, validatedData);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Categories API
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Products API
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.put("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/products/sku/:sku", async (req: Request, res: Response) => {
    try {
      const sku = req.params.sku;
      const product = await storage.getProductBySku(sku);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Inventory API
  app.get("/api/inventory", async (req: Request, res: Response) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/inventory/location/:locationId", async (req: Request, res: Response) => {
    try {
      const locationId = parseInt(req.params.locationId);
      const inventory = await storage.getInventoryByLocation(locationId);
      res.json(inventory);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/inventory/product/:productId", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const inventory = await storage.getInventoryByProduct(productId);
      res.json(inventory);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/inventory", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInventorySchema.parse(req.body);
      
      // Check if inventory already exists for this product and location
      const existingInventory = await storage.getInventoryItem(
        validatedData.productId,
        validatedData.locationId
      );
      
      if (existingInventory) {
        // Update existing inventory
        const updatedInventory = await storage.updateInventory(
          existingInventory.id,
          { quantity: existingInventory.quantity + validatedData.quantity }
        );
        return res.json(updatedInventory);
      }
      
      // Create new inventory
      const inventory = await storage.createInventory(validatedData);
      res.status(201).json(inventory);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.put("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertInventorySchema.partial().parse(req.body);
      const inventory = await storage.updateInventory(id, validatedData);
      if (!inventory) {
        return res.status(404).json({ error: "Inventory not found" });
      }
      res.json(inventory);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Suppliers API
  app.get("/api/suppliers", async (req: Request, res: Response) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/suppliers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplier(id);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.json(supplier);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/suppliers", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.put("/api/suppliers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(id, validatedData);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.json(supplier);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Transactions API
  app.get("/api/transactions", async (req: Request, res: Response) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/transactions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransaction(id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      // Get transaction items
      const items = await storage.getTransactionItems(id);
      
      res.json({ transaction, items });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const { transaction, items } = req.body;
      
      const validatedTransaction = insertTransactionSchema.parse(transaction);
      const createdTransaction = await storage.createTransaction(validatedTransaction);
      
      const transactionItems = [];
      
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const validatedItem = insertTransactionItemSchema.parse({
            ...item,
            transactionId: createdTransaction.id
          });
          
          const createdItem = await storage.createTransactionItem(validatedItem);
          transactionItems.push(createdItem);
          
          // Update inventory for purchase and sale transactions
          if (validatedTransaction.type === 'purchase' || validatedTransaction.type === 'sale') {
            const existingInventory = await storage.getInventoryItem(
              validatedItem.productId,
              validatedTransaction.locationId
            );
            
            const quantityChange = validatedTransaction.type === 'purchase' 
              ? validatedItem.quantity 
              : -validatedItem.quantity;
            
            if (existingInventory) {
              await storage.updateInventory(
                existingInventory.id,
                { quantity: existingInventory.quantity + quantityChange }
              );
            } else if (validatedTransaction.type === 'purchase') {
              await storage.createInventory({
                productId: validatedItem.productId,
                locationId: validatedTransaction.locationId,
                quantity: validatedItem.quantity
              });
            }
          }
        }
      }
      
      res.status(201).json({ transaction: createdTransaction, items: transactionItems });
    } catch (err) {
      handleError(err, res);
    }
  });

  // Payments API
  app.get("/api/payments", async (req: Request, res: Response) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/payments/transaction/:transactionId", async (req: Request, res: Response) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const payments = await storage.getPaymentsByTransaction(transactionId);
      res.json(payments);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/payments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.put("/api/payments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(id, validatedData);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Activity logs API
  app.get("/api/activity", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const logs = await storage.getRecentActivity(limit);
      res.json(logs);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/activity", async (req: Request, res: Response) => {
    try {
      const validatedData = insertActivityLogSchema.parse(req.body);
      const log = await storage.createActivityLog(validatedData);
      res.status(201).json(log);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Analytics API
  app.get("/api/analytics/low-stock", async (req: Request, res: Response) => {
    try {
      const items = await storage.getLowStockItems();
      res.json(items);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/analytics/inventory-value", async (req: Request, res: Response) => {
    try {
      const locationId = req.query.locationId ? parseInt(req.query.locationId as string) : undefined;
      const value = await storage.getInventoryValueByLocation(locationId);
      res.json({ value });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/analytics/inventory-count", async (req: Request, res: Response) => {
    try {
      const locationId = req.query.locationId ? parseInt(req.query.locationId as string) : undefined;
      const count = await storage.getInventoryCountByLocation(locationId);
      res.json({ count });
    } catch (err) {
      handleError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
