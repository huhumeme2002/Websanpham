'use client';

import { Bill } from '@/lib/types';
import { Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface TrustSectionProps {
  bills: Bill[];
}

export function TrustSection({ bills }: TrustSectionProps) {
  if (bills.length === 0) {
    return (
      <section id="trust" className="py-16 md:py-24 bg-[#0d0d14]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-[#00ff88] bg-clip-text text-transparent">
                Giao Dịch Gần Đây
              </span>
            </h2>
            <p className="text-[#a0a0b0]">Chưa có giao dịch nào.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="trust" className="py-16 md:py-24 bg-[#0d0d14]">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-[#00ff88]" />
            <span className="text-[#00ff88] text-sm font-medium tracking-wider uppercase">
              Uy Tín & Chất Lượng
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-[#00ff88] bg-clip-text text-transparent">
              Giao Dịch Gần Đây
            </span>
          </h2>
          <p className="text-[#a0a0b0] max-w-2xl mx-auto">
            Hình ảnh bill giao dịch thực tế từ khách hàng. Cam kết uy tín, giao hàng nhanh chóng.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-full">
            <CheckCircle className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-white">Giao dịch an toàn</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-full">
            <CheckCircle className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-white">Hỗ trợ 24/7</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-full">
            <CheckCircle className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-white">Hoàn tiền nếu lỗi</span>
          </div>
        </div>

        {/* Bills grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#00ff88]/50 transition-all duration-300"
            >
              <Image
                src={bill.imageUrl}
                alt={bill.description || 'Giao dịch'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {bill.description && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white truncate">{bill.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
