import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_LINKS = [
  { id: 'thuc-don', href: '#thuc-don', index: '01', label: 'Thực đơn' },
  { id: 'triet-ly', href: '#triet-ly', index: '02', label: 'Triết lý sạch' },
  { id: 'cua-hang', href: '#cua-hang', index: '03', label: 'Cửa hàng' },
  { id: 'nhuong-quyen', href: '#nhuong-quyen', index: '04', label: 'Nhượng quyền' },
];

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('thuc-don');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const y = window.scrollY;
      setIsScrolled(y > 12);

      const offset = y + 140;
      let current = NAV_LINKS[0].id;
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= offset) {
          current = link.id;
        }
      }
      setActiveSection(current);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-[#24140D]/95 backdrop-blur-md border-b transition-shadow duration-200 ${
        isScrolled
          ? 'border-[#4A2E1E] shadow-[0_8px_24px_-12px_rgba(20,10,5,0.55)]'
          : 'border-[#382216]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#top"
          className="font-display text-lg sm:text-[1.35rem] font-bold tracking-tight text-[#FCFAF7] hover:text-[#E5A952] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5A952]"
        >
          Xíu Bread &amp; Coffee
        </a>

        {/* Zone 2: 4 concise single-line navigation links with animated active underline */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-7 lg:gap-8"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                className={`group relative py-2 text-sm font-semibold tracking-[0.01em] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5A952] ${
                  isActive
                    ? 'text-[#E5A952]'
                    : 'text-[#F0E6D8] hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#E5A952] origin-left transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA button + mobile menu trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={cartCount > 0 ? `Mở giỏ hàng (${cartCount} món)` : 'Đặt món ngay'}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 min-h-[40px] rounded-lg bg-[#E5A952] text-[#24140D] text-xs sm:text-sm font-bold hover:bg-[#F2BA63] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCFAF7]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">
              {cartCount > 0 ? `Giỏ hàng (${cartCount})` : 'Đặt món'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#4D3021] bg-[#2F1B12] text-[#FCFAF7] hover:bg-[#3B2316] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Điều hướng di động"
          className="md:hidden border-t border-[#3B2316] bg-[#1C0F0A] px-4 py-3 flex flex-col divide-y divide-[#2E1B12]"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`py-3.5 px-2 min-h-[48px] flex items-center justify-between text-sm font-semibold transition-colors ${
                  isActive ? 'text-[#E5A952]' : 'text-[#F5EDE1] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono tabular-nums text-xs text-[#C67211]">
                    {link.index}
                  </span>
                  <span>{link.label}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-70" aria-hidden="true" />
              </a>
            );
          })}
          <div className="pt-3 pb-1 px-2 flex items-center justify-between text-xs text-[#CBBBA7]">
            <span>Phục vụ mỗi ngày</span>
            <span className="font-mono tabular-nums text-[#E5A952]">06:00 – 21:30</span>
          </div>
        </nav>
      )}
    </header>
  );
};
