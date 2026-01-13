import { HeroSection } from '@/components/hero-section';
import { ProductGrid } from '@/components/product-grid';
import { TrustSection } from '@/components/trust-section';
import { Footer } from '@/components/footer';
import { getProducts, getBills, siteConfig } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [products, bills] = await Promise.all([
    getProducts(),
    getBills(),
  ]);

  return (
    <main className="min-h-screen">
      <HeroSection
        title={siteConfig.heroTitle}
        subtitle={siteConfig.heroSubtitle}
        ctaText="Xem Sản Phẩm"
        ctaLink="#products"
      />
      
      <ProductGrid products={products} />
      
      <TrustSection bills={bills} />
      
      <Footer
        contactZalo={siteConfig.contactZalo}
        contactMessenger={siteConfig.contactMessenger}
      />
    </main>
  );
}
