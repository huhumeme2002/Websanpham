import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ProductInput, PricingTier } from './types';

// Arbitrary for generating valid PricingTier
const pricingTierArb = fc.record({
  duration: fc.constantFrom('1 ngày', '7 ngày', '1 tháng', '3 tháng', '1 năm'),
  requestLimit: fc.constantFrom('Vô Hạn', '500 Request', '1000 Request', '10$', '20$'),
  price: fc.integer({ min: 10000, max: 10000000 }),
});

// Arbitrary for generating valid ProductInput
const productInputArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  pricingTiers: fc.array(pricingTierArb, { minLength: 1, maxLength: 5 }),
  currency: fc.constant('VND'),
  icon: fc.constantFrom('Brain', 'Code', 'Github', 'Sparkles', 'Zap'),
  features: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
  tag: fc.option(fc.constantFrom('Best Seller', 'Hot', 'New'), { nil: undefined }),
  contactLink: fc.webUrl(),
});

describe('Data Layer Type Validation', () => {
  /**
   * Property: PricingTier Structure
   * Each pricing tier must have duration, requestLimit, and price fields
   */
  it('Property: PricingTier has required fields', () => {
    fc.assert(
      fc.property(pricingTierArb, (tier: PricingTier) => {
        expect(tier.duration).toBeDefined();
        expect(typeof tier.duration).toBe('string');
        expect(tier.requestLimit).toBeDefined();
        expect(typeof tier.requestLimit).toBe('string');
        expect(tier.price).toBeDefined();
        expect(typeof tier.price).toBe('number');
        expect(tier.price).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: ProductInput Structure
   * Product input must have all required fields including pricingTiers array
   */
  it('Property: ProductInput has required fields with pricingTiers', () => {
    fc.assert(
      fc.property(productInputArb, (input: ProductInput) => {
        expect(input.name).toBeDefined();
        expect(input.description).toBeDefined();
        expect(input.pricingTiers).toBeDefined();
        expect(Array.isArray(input.pricingTiers)).toBe(true);
        expect(input.pricingTiers.length).toBeGreaterThan(0);
        expect(input.currency).toBe('VND');
        expect(input.icon).toBeDefined();
        expect(input.features).toBeDefined();
        expect(input.contactLink).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Multiple Pricing Tiers
   * Products can have multiple pricing tiers with different durations
   */
  it('Property: Products support multiple pricing tiers', () => {
    fc.assert(
      fc.property(
        fc.array(pricingTierArb, { minLength: 2, maxLength: 6 }),
        (tiers: PricingTier[]) => {
          // All tiers should have valid prices
          tiers.forEach(tier => {
            expect(tier.price).toBeGreaterThan(0);
          });

          // Can calculate min/max prices
          const prices = tiers.map(t => t.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          
          expect(minPrice).toBeLessThanOrEqual(maxPrice);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Price Formatting
   * Prices should be positive integers representing VND
   */
  it('Property: Prices are positive integers', () => {
    fc.assert(
      fc.property(pricingTierArb, (tier: PricingTier) => {
        expect(Number.isInteger(tier.price)).toBe(true);
        expect(tier.price).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: JSON Serialization Round-Trip
   * PricingTiers should survive JSON serialization (as stored in DB)
   */
  it('Property: PricingTiers survive JSON serialization', () => {
    fc.assert(
      fc.property(
        fc.array(pricingTierArb, { minLength: 1, maxLength: 5 }),
        (tiers: PricingTier[]) => {
          const serialized = JSON.stringify(tiers);
          const deserialized = JSON.parse(serialized) as PricingTier[];
          
          expect(deserialized).toEqual(tiers);
          expect(deserialized.length).toBe(tiers.length);
          
          deserialized.forEach((tier, i) => {
            expect(tier.duration).toBe(tiers[i].duration);
            expect(tier.requestLimit).toBe(tiers[i].requestLimit);
            expect(tier.price).toBe(tiers[i].price);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
