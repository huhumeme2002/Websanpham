import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  pricingTiers: text('pricing_tiers').notNull(), // JSON string array of {duration, requestLimit, price}
  currency: varchar('currency', { length: 10 }).notNull().default('VND'),
  icon: varchar('icon', { length: 50 }).notNull().default('Brain'),
  imageUrl: text('image_url'),
  features: text('features').notNull(), // JSON string array
  tag: varchar('tag', { length: 50 }),
  contactLink: text('contact_link').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bills = pgTable('bills', {
  id: text('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ProductDB = typeof products.$inferSelect;
export type NewProductDB = typeof products.$inferInsert;
export type BillDB = typeof bills.$inferSelect;
export type NewBillDB = typeof bills.$inferInsert;
