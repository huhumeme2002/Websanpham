import { db, products, bills } from './db';
import { eq } from 'drizzle-orm';
import { Product, Bill, ProductInput, ProductUpdate, PricingTier } from './types';

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Convert DB product to app Product
function toProduct(dbProduct: typeof products.$inferSelect): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    pricingTiers: JSON.parse(dbProduct.pricingTiers) as PricingTier[],
    currency: dbProduct.currency,
    icon: dbProduct.icon,
    imageUrl: dbProduct.imageUrl || undefined,
    features: JSON.parse(dbProduct.features),
    tag: dbProduct.tag || undefined,
    contactLink: dbProduct.contactLink,
    sortOrder: dbProduct.sortOrder,
    createdAt: dbProduct.createdAt.toISOString(),
    updatedAt: dbProduct.updatedAt.toISOString(),
  };
}

// Convert DB bill to app Bill
function toBill(dbBill: typeof bills.$inferSelect): Bill {
  return {
    id: dbBill.id,
    imageUrl: dbBill.imageUrl,
    description: dbBill.description || undefined,
    createdAt: dbBill.createdAt.toISOString(),
  };
}

// CRUD Operations - Products
export async function getProducts(): Promise<Product[]> {
  const result = await db.select().from(products).orderBy(products.sortOrder, products.createdAt);
  return result.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0] ? toProduct(result[0]) : undefined;
}

export async function addProduct(input: ProductInput): Promise<Product> {
  const id = generateId();
  const now = new Date();
  
  const newProduct = {
    id,
    name: input.name,
    description: input.description,
    pricingTiers: JSON.stringify(input.pricingTiers),
    currency: input.currency,
    icon: input.icon,
    imageUrl: input.imageUrl || null,
    features: JSON.stringify(input.features),
    tag: input.tag || null,
    contactLink: input.contactLink,
    sortOrder: input.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(products).values(newProduct);
  return toProduct(newProduct);
}

export async function updateProduct(id: string, updates: ProductUpdate): Promise<Product | undefined> {
  const existing = await getProductById(id);
  if (!existing) return undefined;

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.pricingTiers !== undefined) updateData.pricingTiers = JSON.stringify(updates.pricingTiers);
  if (updates.currency !== undefined) updateData.currency = updates.currency;
  if (updates.icon !== undefined) updateData.icon = updates.icon;
  if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl || null;
  if (updates.features !== undefined) updateData.features = JSON.stringify(updates.features);
  if (updates.tag !== undefined) updateData.tag = updates.tag || null;
  if (updates.contactLink !== undefined) updateData.contactLink = updates.contactLink;
  if (updates.sortOrder !== undefined) updateData.sortOrder = updates.sortOrder;

  await db.update(products).set(updateData).where(eq(products.id, id));
  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await db.delete(products).where(eq(products.id, id));
  return true;
}

// Reorder products
export async function reorderProducts(orderedIds: string[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await db.update(products).set({ sortOrder: i, updatedAt: new Date() }).where(eq(products.id, orderedIds[i]));
  }
}

// CRUD Operations - Bills
export async function getBills(): Promise<Bill[]> {
  const result = await db.select().from(bills).orderBy(bills.createdAt);
  return result.map(toBill);
}

export async function getBillById(id: string): Promise<Bill | undefined> {
  const result = await db.select().from(bills).where(eq(bills.id, id));
  return result[0] ? toBill(result[0]) : undefined;
}

export async function addBill(imageUrl: string, description?: string): Promise<Bill> {
  const id = generateId();
  const now = new Date();

  const newBill = {
    id,
    imageUrl,
    description: description || null,
    createdAt: now,
  };

  await db.insert(bills).values(newBill);
  return toBill(newBill);
}

export async function deleteBill(id: string): Promise<boolean> {
  await db.delete(bills).where(eq(bills.id, id));
  return true;
}

// Site configuration (static for now)
export const siteConfig = {
  heroTitle: 'Sản Phẩm AI với giá tốt nhất Việt Nam',
  heroSubtitle: 'Cung cấp tài khoản AI chính hãng: Cursor Pro, Windsurf, Augment, KiroCode, AntiGravity với giá tốt nhất. Giao dịch nhanh chóng, uy tín.',
  contactZalo: 'https://zalo.me/0944568913',
  contactMessenger: 'https://m.me/aishop',
};
