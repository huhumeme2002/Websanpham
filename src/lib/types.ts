// Pricing tier for each product (e.g., 1 day, 7 days, 1 month)
export interface PricingTier {
  duration: string; // "1 ngày", "7 ngày", "1 tháng", "Basic", "Pro", etc.
  requestLimit: string; // "Vô Hạn", "500 Request", "10$", etc.
  price: number; // Price in VND
}

export interface Product {
  id: string;
  name: string;
  description: string;
  pricingTiers: PricingTier[]; // Multiple pricing options
  currency: string;
  icon: string; // Lucide icon name
  imageUrl?: string; // Custom product image URL
  features: string[];
  tag?: string; // "Best Seller", "Hot", etc.
  contactLink: string; // Zalo or Messenger URL
  sortOrder: number; // For ordering products
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  contactZalo: string;
  contactMessenger: string;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'> & { sortOrder?: number };
export type ProductUpdate = Partial<Omit<Product, 'id' | 'createdAt'>>;
