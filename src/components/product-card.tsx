import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Product } from '@/lib/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

// Dynamic icon component
function ProductIcon({ iconName, className }: { iconName: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[iconName];
  if (!IconComponent) {
    return <LucideIcons.Package className={className} />;
  }
  return <IconComponent className={className} />;
}

// Format price in VND
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export function ProductCard({ product }: ProductCardProps) {
  // Get min and max price for display
  const prices = product.pricingTiers.map(t => t.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasMultiplePrices = minPrice !== maxPrice;

  return (
    <Card className="group relative bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] overflow-hidden flex flex-col">
      {/* Tag badge */}
      {product.tag && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0a0f]">
            {product.tag}
          </span>
        </div>
      )}
      
      <CardHeader className="pb-2">
        {/* Image or Icon */}
        {product.imageUrl ? (
          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-[#0a0a0f]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#00ff88]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <ProductIcon iconName={product.icon} className="w-7 h-7 text-[#00d4ff]" />
          </div>
        )}
        
        {/* Name */}
        <h3 className="text-lg font-bold text-white group-hover:text-[#00d4ff] transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* Price Range */}
        <div className="mt-2">
          {hasMultiplePrices ? (
            <span className="text-xl font-bold text-[#00ff88]">
              {formatPrice(minPrice)} - {formatPrice(maxPrice)}
            </span>
          ) : (
            <span className="text-2xl font-bold text-[#00ff88]">
              {formatPrice(minPrice)}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-1">
        {/* Description */}
        {product.description && (
          <p className="text-white text-sm mb-3 line-clamp-2 font-medium">
            {product.description}
          </p>
        )}

        {/* Pricing Tiers Table */}
        <div className="mb-3 rounded-lg overflow-hidden border border-[#2a2a3e]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#0a0a0f]">
                <th className="px-2 py-1.5 text-left text-[#00d4ff] font-medium">Gói</th>
                <th className="px-2 py-1.5 text-left text-[#00d4ff] font-medium">Request</th>
                <th className="px-2 py-1.5 text-right text-[#00d4ff] font-medium">Giá</th>
              </tr>
            </thead>
            <tbody>
              {product.pricingTiers.map((tier, index) => (
                <tr key={index} className="border-t border-[#2a2a3e] hover:bg-[#2a2a3e]/50">
                  <td className="px-2 py-1.5 text-white">{tier.duration}</td>
                  <td className="px-2 py-1.5 text-[#a0a0b0]">{tier.requestLimit}</td>
                  <td className="px-2 py-1.5 text-right text-[#00ff88] font-semibold">
                    {formatPrice(tier.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Features */}
        {product.features.length > 0 && product.features[0] && (
          <ul className="space-y-1.5">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#00ff88] mt-0.5 flex-shrink-0" />
                <span className="text-white font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          asChild
          className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity"
        >
          <a href={product.contactLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Mua Ngay
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
