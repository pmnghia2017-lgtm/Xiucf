import React, { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { StoreBranch } from '../data/storeData';
import { assetUrl } from '../utils/assetUrl';

interface HeroSectionProps {
  activeBranch: StoreBranch;
  onQuickOrderCombo: () => void;
}

const CRAFT_STANDARDS = [
  { metric: '05:30', label: 'Mẻ bánh đầu ra lò mỗi sáng' },
  { metric: '100%', label: 'Hạt Robusta & Arabica rang mộc' },
  { metric: '0%', label: 'Chất bảo quản & phụ gia tẩy trắng' },
  { metric: '5 điểm', label: 'Cửa hàng phục vụ tại TP.HCM' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeBranch,
  onQuickOrderCombo,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="border-b border-[#E7DEC9] bg-[#FCFAF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8 lg:pt-8 lg:pb-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left column: Focal message & action */}
          <div className="lg:col-span-7 flex flex-col justify-between py-1">
            <div>
              <p className="text-sm font-medium text-[#1E6B3A] tracking-wide mb-2.5">
                Bánh mì tươi · Cà phê thật · Thực phẩm sạch
              </p>

              <h1 className="font-display text-[clamp(2.15rem,3.6vw,3.35rem)] leading-[1.1] font-bold tracking-tight text-[#24140D] max-w-2xl mb-3.5">
                Ổ bánh giòn rụm mỗi sáng, ly cà phê rang mộc trọn vị.
              </h1>

              <p className="text-base text-[#5A4336] leading-relaxed max-w-xl mb-5">
                Xíu Bread &amp; Coffee nướng bánh liên tục tại quầy từ 5 giờ 30 sáng,
                kết hợp cùng cà phê pha phin nguyên chất từ Cầu Đất và nguyên liệu
                truy xuất sạch mỗi ngày.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-5">
                <a
                  href="#thuc-don"
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-[#C67211] text-white text-sm font-semibold hover:bg-[#AD610C] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24140D]"
                >
                  <span>Khám phá thực đơn</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={onQuickOrderCombo}
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-lg border border-[#D8CCB8] bg-white text-[#24140D] text-sm font-medium hover:bg-[#F5EFE4] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C67211]"
                >
                  Đặt nhanh Combo sáng
                </button>
              </div>
            </div>

            {/* Quiet Flagship location anchor */}
            <div className="pt-4 border-t border-[#E7DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C67211] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-[#7A6153]">
                    Chi nhánh đang chọn phục vụ
                  </p>
                  <p className="text-sm font-semibold text-[#24140D]">
                    {activeBranch.name} — {activeBranch.address}
                  </p>
                </div>
              </div>
              <a
                href="#cua-hang"
                className="text-sm font-medium text-[#C67211] hover:text-[#9E5708] underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                Đổi chi nhánh
              </a>
            </div>
          </div>

          {/* Right column: Authentic storefront photograph */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <figure className="w-full max-w-[390px] lg:max-w-none rounded-xl overflow-hidden border border-[#E2D6C3] bg-[#24140D] flex flex-col shadow-sm">
              <div className="relative h-[390px] sm:h-[430px] lg:h-[462px]">
                {!imgError ? (
                  <img
                    src={assetUrl('/assets/aistudio/image_bedee89f.png')}
                    alt="Mặt tiền cửa hàng Xíu Bread & Coffee tại 179A Cách Mạng Tháng 8, Phường Bàn Cờ với tủ bánh mì tươi và quầy pha chế"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-[50%_28%] filter brightness-[1.01] contrast-[1.04] saturate-[1.05]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#3B2316] to-[#24140D] text-[#FCFAF7]">
                    <p className="font-display text-2xl font-bold mb-2">Xíu Bread &amp; Coffee</p>
                    <p className="text-sm text-[#E7DEC9]">179A CMT8, P. Bàn Cờ, Quận 3</p>
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0 shadow-[inset_0_0_24px_rgba(26,14,8,0.22)]"
                  aria-hidden="true"
                />
              </div>
              <figcaption className="px-4 py-2.5 bg-[#24140D] text-[#F5EDE1] text-xs flex items-center justify-between gap-3">
                <span className="truncate">Flagship 179A CMT8, P. Bàn Cờ, Q.3</span>
                <span className="font-mono tabular-nums text-[#E5A952] shrink-0">
                  06:00 – 21:30
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Full-width 4-column craft standards strip below split */}
        <div className="mt-6 pt-5 border-t border-[#E7DEC9] grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CRAFT_STANDARDS.map((item) => (
            <div key={item.metric}>
              <p className="font-mono tabular-nums text-2xl font-semibold text-[#24140D]">
                {item.metric}
              </p>
              <p className="text-sm text-[#5A4336] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
