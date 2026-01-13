import { Product } from '@/lib/types';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section id="products" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
                Sản Phẩm
              </span>
            </h2>
            <p className="text-[#a0a0b0]">Chưa có sản phẩm nào.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Sản Phẩm AI Premium
            </span>
          </h2>
          <p className="text-[#a0a0b0] max-w-2xl mx-auto">
            Các công cụ AI hàng đầu với giá tốt nhất thị trường. Giao dịch nhanh chóng, hỗ trợ 24/7.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
