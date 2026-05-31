import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CustomerDetails } from '../types';

interface CatalogContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  cart: CartItem[];
  customerDetails: CustomerDetails;
  pwaInstallPrompt: any;
  isPwaInstallable: boolean;
  addToCart: (product: Product, qtyDelta?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  saveCustomerDetails: (details: CustomerDetails) => void;
  triggerPWAInstall: () => void;
  refreshCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTBa75Pp8H49s7afL21CLZ1d8A1E77cYRcowm8wM7pC7fwFdlh4HpjZeD3EkLHIQAUbcUHl6XWYpAGK/pub?output=csv';

// Robust CSV Parser
function parseCSV(csvText: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let currentVal = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      row.push(currentVal.trim());
      if (row.length > 0 && row.some(cell => cell !== '')) {
        result.push(row);
      }
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    result.push(row);
  }
  return result;
}

export const CatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cart Local Storage Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ae_wholesale_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Customer Details Local Storage Persistence
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(() => {
    const saved = localStorage.getItem('ae_customer_details');
    return saved ? JSON.parse(saved) : { name: '', mobile: '', shopName: '', address: '' };
  });

  // PWA Install states
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);
  const [isPwaInstallable, setIsPwaInstallable] = useState<boolean>(false);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('ae_wholesale_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Customer Details to LocalStorage
  useEffect(() => {
    localStorage.setItem('ae_customer_details', JSON.stringify(customerDetails));
  }, [customerDetails]);

  // Load PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
      setIsPwaInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If app is already installed
    window.addEventListener('appinstalled', () => {
      setIsPwaInstallable(false);
      setPwaInstallPrompt(null);
      console.log('[PWA] Mahabir Quantum India was installed.');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Fetch and Parse Spreadsheet Catalog
  const fetchCatalogData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(SHEET_CSV_URL);
      if (!response.ok) {
        throw new Error(`Failed to load sheet. HTTP Status: ${response.status}`);
      }

      const csvData = await response.text();
      const parsedRows = parseCSV(csvData);

      if (parsedRows.length <= 1) {
        throw new Error('Spreadsheet catalog contains no products or headers.');
      }

      const headerRow = parsedRows[0].map(h => h.trim().toLowerCase());
      
      // Dynamic index detection
      let nameIdx = headerRow.indexOf('name');
      let rateIdx = headerRow.indexOf('rate');
      let piecesIdx = headerRow.findIndex(h => h.includes('cartoon') || h.includes('carton') || h.includes('pieces'));
      let minOrderIdx = headerRow.findIndex(h => h.includes('minimum') || h.includes('order') || h.includes('mov') || h.includes('value'));
      let descIdx = headerRow.indexOf('description');
      let imageUrlIdx = headerRow.findIndex(h => h.includes('url') || h.includes('image url'));

      // Fallbacks if mapping fails
      if (nameIdx === -1) nameIdx = 2;
      if (rateIdx === -1) rateIdx = 3;
      if (piecesIdx === -1) piecesIdx = 4;
      if (minOrderIdx === -1) minOrderIdx = 5;
      if (descIdx === -1) descIdx = 6;
      if (imageUrlIdx === -1) imageUrlIdx = 7;

      const formattedProducts: Product[] = [];

      for (let i = 1; i < parsedRows.length; i++) {
        const row = parsedRows[i];
        
        // Skip empty or malformed rows
        if (!row || row.length < 3 || !row[nameIdx]) continue;

        const name = row[nameIdx]?.trim() || '';
        const rawRate = row[rateIdx]?.trim() || '';
        const rawPieces = row[piecesIdx]?.trim() || 'N/A';
        const rawMinOrder = row[minOrderIdx]?.trim() || '0';
        const description = row[descIdx]?.trim() || 'No description available.';
        const imageUrl = row[imageUrlIdx]?.trim() || '';

        // Extract numeric rates
        const numericRate = parseFloat(rawRate.replace(/[^\d.]/g, '')) || 0;
        
        // Extract numeric minimum order value
        const numericMinOrder = parseFloat(rawMinOrder.replace(/[^\d.]/g, '')) || 0;

        // Build product identifier
        const productId = `ae-prod-${i}-${name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

        formattedProducts.push({
          id: productId,
          name,
          rate: numericRate,
          rateDisplay: rawRate.startsWith('₹') ? rawRate : `₹${rawRate}`,
          perCartoonPieces: rawPieces,
          minimumOrderValue: numericMinOrder,
          minimumOrderValueDisplay: rawMinOrder.replace('₹', '').trim(),
          description,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=500&auto=format&fit=crop&q=60' // premium fallback icon
        });
      }

      setProducts(formattedProducts);
    } catch (err: any) {
      console.error('Catalog Fetch Error:', err);
      setError(err?.message || 'Error occurred while loading Mahabir Quantum India wholesale products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  // Cart Operations
  const addToCart = (product: Product, qtyDelta: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const updatedQty = existing.quantity + qtyDelta;
        if (updatedQty <= 0) {
          return prev.filter(item => item.product.id !== product.id);
        }
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: updatedQty } : item);
      }
      return [...prev, { product, quantity: qtyDelta }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveCustomerDetails = (details: CustomerDetails) => {
    setCustomerDetails(details);
  };

  const triggerPWAInstall = () => {
    if (pwaInstallPrompt) {
      pwaInstallPrompt.prompt();
      pwaInstallPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted installation prompt');
        } else {
          console.log('[PWA] User dismissed installation prompt');
        }
        setPwaInstallPrompt(null);
        setIsPwaInstallable(false);
      });
    }
  };

  return (
    <CatalogContext.Provider value={{
      products,
      loading,
      error,
      cart,
      customerDetails,
      pwaInstallPrompt,
      isPwaInstallable,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      saveCustomerDetails,
      triggerPWAInstall,
      refreshCatalog: fetchCatalogData
    }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
