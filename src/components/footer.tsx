import { MessageCircle, Phone } from 'lucide-react';

interface FooterProps {
  contactZalo?: string;
  contactMessenger?: string;
}

export function Footer({ 
  contactZalo = 'https://zalo.me/0944568913',
  contactMessenger = 'https://m.me/aishop'
}: FooterProps) {
  return (
    <footer className="py-12 bg-[#0a0a0f] border-t border-[#2a2a3e]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                AI Shop
              </span>
            </h3>
            <p className="text-[#a0a0b0] text-sm">
              Cung cấp tài khoản AI chính hãng với giá tốt nhất. Uy tín, nhanh chóng, hỗ trợ 24/7.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên Hệ Mua Hàng</h4>
            <div className="space-y-3">
              <a
                href={contactZalo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#00ff88] hover:text-[#00d4ff] transition-colors font-semibold"
              >
                <Phone className="w-5 h-5" />
                <span>Zalo: 0944568913</span>
              </a>
              <a
                href={contactMessenger}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#a0a0b0] hover:text-[#00d4ff] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Messenger</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Điều Hướng</h4>
            <div className="space-y-3">
              <a
                href="#products"
                className="block text-[#a0a0b0] hover:text-[#00d4ff] transition-colors"
              >
                Sản Phẩm
              </a>
              <a
                href="#trust"
                className="block text-[#a0a0b0] hover:text-[#00d4ff] transition-colors"
              >
                Bằng Chứng Giao Dịch
              </a>
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#00d4ff]/10 to-[#00ff88]/10 rounded-xl border border-[#2a2a3e]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold text-lg">Cần hỗ trợ? Liên hệ ngay!</h4>
              <p className="text-[#a0a0b0] text-sm">Tư vấn miễn phí, hỗ trợ 24/7</p>
            </div>
            <a
              href={contactZalo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0a0f] font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Zalo: 0944568913
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#2a2a3e] text-center">
          <p className="text-[#a0a0b0] text-sm">
            © {new Date().getFullYear()} AI Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
