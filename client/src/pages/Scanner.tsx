import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/common/PageTitle";
import BarcodeScanner from "@/components/scanner/BarcodeScanner";
import RecentlyScannedItems from "@/components/scanner/RecentlyScannedItems";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  sku: string;
  sellingPrice: number;
}

interface ScannedItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

export default function Scanner() {
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  const handleBarcodeDetected = (code: string) => {
    // Find product by SKU or barcode in the products list
    if (!products) return;
    
    const product = products.find(
      (p: Product) => p.sku === code
    );
    
    if (product) {
      // Check if product is already in scanned items
      const existingItem = scannedItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if already scanned
        setScannedItems(prevItems => 
          prevItems.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        );
      } else {
        // Add new item
        setScannedItems(prevItems => [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.sellingPrice,
            quantity: 1
          }
        ]);
      }
      
      toast({
        title: "Product Scanned",
        description: `${product.name} has been added to your list`,
      });
    } else {
      toast({
        title: "Product Not Found",
        description: `No product with code ${code} found in the system`,
        variant: "destructive"
      });
    }
  };

  const handleInventoryUpdate = () => {
    // Clear scanned items after update
    setScannedItems([]);
    
    toast({
      title: "Inventory Updated",
      description: "Your changes have been saved successfully"
    });
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Barcode Scanner"
        subtitle="Scan product barcodes to quickly update inventory"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarcodeScanner onDetected={handleBarcodeDetected} />
        
        <RecentlyScannedItems 
          items={scannedItems} 
          onUpdateInventory={handleInventoryUpdate}
        />
      </div>
    </div>
  );
}
