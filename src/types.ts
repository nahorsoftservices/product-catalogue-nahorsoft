/**
 * TypeScript Type Definitions for Asian Electronics Wholesale Catalog
 */

export interface Product {
  id: string; // Unique string identifier
  name: string;
  rate: number; // Clean numeric rate for calculations
  rateDisplay: string; // Formatted display rate (e.g., "₹350")
  perCartoonPieces: string; // Wholesale carton packing specs (e.g., "120 Pcs")
  minimumOrderValue: number; // Clean numeric MOQ for validations
  minimumOrderValueDisplay: string; // Formatted MOQ (e.g., "₹10,000" or similar)
  description: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  shopName: string;
  address: string;
}
