import React from 'react';
import { MENU_CATEGORIES, MenuCategory } from '../data/storeData';

interface FooterProps {
  onSelectMenuCategory?: (category: MenuCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectMenuCategory }) => {
  const handleJumpCategory = (category: MenuCategory) => {
    onSelectMenuCategory?.(category);
  };

  return (
    <footer className="bg-[#24140D] text-[#E2D6C5] border-t border-[#3B2316]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#3D2518]">
          <div className="md:col-span-4">
            <p className="font-display text-2xl font-bold text-white mb-2">
              Xíu Bread &amp; Coffee
            </p>
            <p className="text-sm text-[#77C992] mb-3">
              Bánh mì tươi – Cà phê thật – Thực phẩm sạch
            </p>
            <p className="text-sm text-[#CBBBA7] leading-relaxed max-w-sm">
              Chuỗi cửa hàng bánh mì nóng giòn nướng tại lò mỗi ngày và cà phê rang xay
              nguyên chất phục vụ tại TP. Hồ Chí Minh.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <p className="font-semibold text-white mb-2">Cửa hàng trung tâm</p>
            <p>179A Cách Mạng Tháng 8, P. Bàn Cờ, Quận 3, TP.HCM</p>
            <p className="font-mono tabular-nums text-[#E5A952]">
              Giờ mở cửa: 06:00 – 21:30 hằng ngày
            </p>
            <p className="font-mono tabular-nums">Hotline: 028 3832 1790</p>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <p className="font-semibold text-white mb-2">Danh mục thực đơn</p>
            <ul className="space-y-1.5">
              {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#thuc-don"
                    onClick={() => handleJumpCategory(cat.id)}
                    className="hover:text-[#E5A952] transition-colors"
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2 text-sm">
            <p className="font-semibold text-white mb-2">Khám phá</p>
            <ul className="space-y-1.5">
              <li>
                <a href="#triet-ly" className="hover:text-[#E5A952] transition-colors">
                  Triết lý thực phẩm sạch
                </a>
              </li>
              <li>
                <a href="#cua-hang" className="hover:text-[#E5A952] transition-colors">
                  Hệ thống 5 chi nhánh
                </a>
              </li>
              <li>
                <a href="#nhuong-quyen" className="hover:text-[#E5A952] transition-colors">
                  Hợp tác nhượng quyền
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#A89683]">
          <p>© 2026 Xíu Bread &amp; Coffee. Bảo lưu mọi quyền.</p>
          <p>Tiêu chuẩn an toàn vệ sinh thực phẩm · TP. Hồ Chí Minh</p>
        </div>
      </div>
    </footer>
  );
};
