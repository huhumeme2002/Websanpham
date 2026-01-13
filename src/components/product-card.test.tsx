import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import { ProductCard } from './product-card';
import { Product, PricingTier } from '@/lib/types';

// Cleanup after each test to prevent DOM pollution
afterEach(() => {
  cleanup();
});

// Arbitrary for generating valid PricingTier
const pricingTierArb = fc.record({
  duration: fc.constantFrom('1 ngày', '7 ngày', '1 tháng', '3 tháng', '1 năm'),
  requestLimit: fc.constantFrom('Vô Hạn', '500 Request', '1000 Request'),
  price: fc.integer({ min: 10000, max: 10000000 }),
});

// Arbitrary for generating valid Product objects with non-whitespace strings
const productArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  pricingTiers: fc.array(pricingTierArb, { minLength: 1, maxLength: 5 }),
  currency: fc.constant('VND'),
  icon: fc.constantFrom('Brain', 'Code', 'Github', 'Sparkles', 'Zap'),
  features: fc.array(
    fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), 
    { minLength: 1, maxLength: 5 }
  ),
  tag: fc.option(fc.constantFrom('Best Seller', 'Hot', 'New'), { nil: undefined }),
  contactLink: fc.webUrl(),
  createdAt: fc.constant('2024-01-01T00:00:00Z'),
  updatedAt: fc.constant('2024-01-01T00:00:00Z'),
});

describe('ProductCard Component', () => {
  /**
   * Feature: ai-products-landing-page, Property 1: Product Card Completeness
   * For any Product object passed to ProductCard, the rendered output SHALL contain
   * the product name, pricing tiers table, features, and a "Buy Now" button.
   * Validates: Requirements 2.2, 2.3
   */
  it('Property 1: Product Card Completeness - renders all required product information', () => {
    fc.assert(
      fc.property(productArb, (product: Product) => {
        cleanup(); // Ensure clean state
        const { container } = render(<ProductCard product={product} />);

        // Product name should be present
        const nameElement = container.querySelector('h3');
        expect(nameElement?.textContent).toBe(product.name);

        // Pricing table should be present
        const table = container.querySelector('table');
        expect(table).not.toBeNull();

        // All pricing tiers should be in the table
        const tableRows = container.querySelectorAll('tbody tr');
        expect(tableRows.length).toBe(product.pricingTiers.length);

        // Min price should be displayed in header
        const prices = product.pricingTiers.map(t => t.price);
        const minPrice = Math.min(...prices);
        const formattedMinPrice = new Intl.NumberFormat('vi-VN').format(minPrice);
        const priceText = container.textContent || '';
        expect(priceText).toContain(formattedMinPrice);

        // "Mua Ngay" (Buy Now) button should be present with correct link
        const buyButton = container.querySelector('a[href]');
        expect(buyButton).toBeDefined();
        expect(buyButton?.getAttribute('href')).toBe(product.contactLink);
        expect(buyButton?.textContent).toContain('Mua Ngay');
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Feature: ai-products-landing-page, Property 2: Product Tag Display
   * For any Product with a defined tag property, the ProductCard SHALL display the tag;
   * for any Product without a tag (undefined), no tag element SHALL be rendered.
   * Validates: Requirements 2.4
   */
  it('Property 2: Product Tag Display - shows tag when defined, hides when undefined', () => {
    fc.assert(
      fc.property(productArb, (product: Product) => {
        cleanup(); // Ensure clean state
        const { container } = render(<ProductCard product={product} />);

        // Find the tag badge container (absolute positioned div at top-right)
        const tagContainer = container.querySelector('.absolute.top-4.right-4');
        
        if (product.tag) {
          // Tag should be displayed
          expect(tagContainer).not.toBeNull();
          expect(tagContainer?.textContent).toBe(product.tag);
        } else {
          // Tag container should not exist
          expect(tagContainer).toBeNull();
        }
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Feature: ai-products-landing-page, Property 3: Pricing Tiers Display
   * For any Product with multiple pricing tiers, all tiers should be displayed
   * in the pricing table with duration, request limit, and price.
   */
  it('Property 3: Pricing Tiers Display - shows all pricing tiers in table', () => {
    fc.assert(
      fc.property(productArb, (product: Product) => {
        cleanup();
        const { container } = render(<ProductCard product={product} />);

        // Each tier should have its price displayed
        product.pricingTiers.forEach((tier: PricingTier) => {
          const formattedPrice = new Intl.NumberFormat('vi-VN').format(tier.price);
          const tableText = container.querySelector('table')?.textContent || '';
          expect(tableText).toContain(formattedPrice);
        });
      }),
      { numRuns: 50 }
    );
  });
});
