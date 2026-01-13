import { describe, it, expect, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import { TrustSection } from './trust-section';
import { Bill } from '@/lib/types';

// Mock next/image since it requires Next.js context
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Arbitrary for generating valid Bill objects
const billArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  imageUrl: fc.webUrl(),
  description: fc.option(
    fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    { nil: undefined }
  ),
  createdAt: fc.constant('2024-01-01T00:00:00Z'),
});

// Arbitrary for generating arrays of bills
const billsArb = fc.array(billArb, { minLength: 1, maxLength: 10 });

describe('TrustSection Component', () => {
  /**
   * Feature: ai-products-landing-page, Property 3: Bill Image Rendering
   * For any array of Bill objects passed to TrustSection, the rendered output SHALL
   * contain an image element for each bill with src matching the bill's imageUrl.
   * Validates: Requirements 3.2
   */
  it('Property 3: Bill Image Rendering - renders an image for each bill with correct src', () => {
    fc.assert(
      fc.property(billsArb, (bills: Bill[]) => {
        cleanup(); // Ensure clean state
        const { container } = render(<TrustSection bills={bills} />);

        // Find all images in the grid
        const images = container.querySelectorAll('img');
        
        // Should have same number of images as bills
        expect(images.length).toBe(bills.length);

        // Each bill's imageUrl should be present as an img src
        bills.forEach((bill) => {
          const matchingImage = Array.from(images).find(
            img => img.getAttribute('src') === bill.imageUrl
          );
          expect(matchingImage).toBeDefined();
        });
      }),
      { numRuns: 100 }
    );
  });

  it('renders empty state when no bills provided', () => {
    const { container } = render(<TrustSection bills={[]} />);
    
    // Should show empty message
    expect(container.textContent).toContain('Chưa có giao dịch nào');
    
    // Should not have any bill images
    const images = container.querySelectorAll('img');
    expect(images.length).toBe(0);
  });
});
