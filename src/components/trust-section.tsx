'use client';

import { useState } from 'react';
import { Bill } from '@/lib/types';
import { Shield, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface TrustSectionProps {
  bills: Bill[];
}

export function TrustSection({ bills }: TrustSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < bills.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

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
    <>
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
            {bills.map((bill, index) => (
              <div
                key={bill.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#00ff88]/50 transition-all duration-300 cursor-pointer"
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                      Xem ảnh
                    </span>
                  </div>
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

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous button */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Next button */}
          {selectedIndex < bills.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Image */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={bills[selectedIndex].imageUrl}
              alt={bills[selectedIndex].description || 'Giao dịch'}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {selectedIndex + 1} / {bills.length}
            {bills[selectedIndex].description && (
              <span className="ml-2 text-[#a0a0b0]">- {bills[selectedIndex].description}</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
