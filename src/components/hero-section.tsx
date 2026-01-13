import { Button } from '@/components/ui/button';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({ 
  title, 
  subtitle, 
  ctaText = 'Xem Sản Phẩm',
  ctaLink = '#products' 
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
      
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff] rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff88] rounded-full blur-[150px] opacity-15" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-[#00d4ff]" />
          <span className="text-[#00d4ff] text-sm font-medium tracking-wider uppercase">
            AI Tools Shop
          </span>
          <Sparkles className="w-6 h-6 text-[#00d4ff]" />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        
        <div className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          <p className="text-white font-semibold">
            Cung cấp tài khoản AI chính hãng: {' '}
            <span className="text-[#00d4ff]">Cursor Pro</span>, {' '}
            <span className="text-[#00ff88]">Windsurf</span>, {' '}
            <span className="text-[#00d4ff]">Augment</span>, {' '}
            <span className="text-[#00ff88]">KiroCode</span>, {' '}
            <span className="text-[#00d4ff]">AntiGravity</span> {' '}
            với giá tốt nhất.
          </p>
          <p className="mt-2 text-[#00ff88] font-bold text-xl md:text-2xl">
            ✨ Giao dịch nhanh chóng, uy tín ✨
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity px-8"
          >
            <a href={ctaLink}>
              <Zap className="w-5 h-5 mr-2" />
              {ctaText}
            </a>
          </Button>
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#ff6b35] to-[#f7c531] text-[#0a0a0f] font-bold hover:opacity-90 transition-all px-8 shadow-[0_0_30px_rgba(255,107,53,0.5)] hover:shadow-[0_0_40px_rgba(255,107,53,0.7)] animate-pulse"
          >
            <a href="#trust">
              <ShieldCheck className="w-5 h-5 mr-2" />
              🔥 Xem Bằng Chứng Giao Dịch
            </a>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[#00ff88]">500+</div>
            <div className="text-sm text-[#a0a0b0]">Khách hàng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[#00d4ff]">24/7</div>
            <div className="text-sm text-[#a0a0b0]">Hỗ trợ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[#00ff88]">100%</div>
            <div className="text-sm text-[#a0a0b0]">Uy tín</div>
          </div>
        </div>
      </div>
    </section>
  );
}
