import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Check, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS, MenuCategory, MenuItem } from '../data/storeData';
import {
  MenuSortMode,
  filterMenuItems,
  formatVND,
  sortMenuItems,
} from '../utils/storeLogic';
import { ArtisanImage } from './ArtisanImage';
import { ProductArtwork } from './ProductArtwork';

interface MenuSectionProps {
  selectedCategory?: MenuCategory;
  onSelectCategory?: (category: MenuCategory) => void;
  onQuickAdd: (item: MenuItem) => void;
  onInspectItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  selectedCategory: controlledCategory,
  onSelectCategory,
  onQuickAdd,
  onInspectItem,
}) => {
  const [internalCategory, setInternalCategory] = useState<MenuCategory>('all');
  const [sortMode, setSortMode] = useState<MenuSortMode>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const selectedCategory = controlledCategory ?? internalCategory;
  const setSelectedCategory = (cat: MenuCategory) => {
    setInternalCategory(cat);
    onSelectCategory?.(cat);
  };

  useEffect(() => {
    if (!justAddedId) return;
    const t = window.setTimeout(() => setJustAddedId(null), 1100);
    return () => window.clearTimeout(t);
  }, [justAddedId]);

  const categoryCounts = useMemo(() => {
    const counts: Record<MenuCategory, number> = {
      all: MENU_ITEMS.length,
      'banh-mi': 0,
      'ca-phe': 0,
      'banh-ngot': 0,
      combo: 0,
    };
    for (const item of MENU_ITEMS) {
      counts[item.category] += 1;
    }
    return counts;
  }, []);

  const visibleItems = useMemo(() => {
    const filtered = filterMenuItems(MENU_ITEMS, selectedCategory, searchQuery);
    return sortMenuItems(filtered, sortMode);
  }, [selectedCategory, searchQuery, sortMode]);

  const handleCardQuickAdd = (item: MenuItem) => {
    onQuickAdd(item);
    setJustAddedId(item.id);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortMode('default');
    setSelectedCategory('all');
  };

  return (
    <section id="thuc-don" className="scroll-mt-16 py-16 lg:py-20 bg-[#FCFAF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header + solid pairing callout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-sm font-semibold text-[#9E5508] mb-2">
              Thực đơn mỗi ngày
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#24140D]">
              Món ngon nướng nóng &amp; pha phin tại quầy
            </h2>
          </div>

          <div className="rounded-xl bg-[#24140D] text-[#FCFAF7] px-5 py-3.5 border border-[#3D2518] max-w-md shrink-0">
            <p className="text-sm font-semibold text-[#E5A952]">
              Ghép 1 Bánh mì tươi + 1 Cà phê thật → Giảm ngay 8%
            </p>
            <p className="text-xs text-[#DFD1BF] mt-1">
              Tự động áp dụng trong giỏ hàng · Hoặc nhập mã{' '}
              <span className="font-mono font-semibold text-white">XIU10</span> giảm 10%
            </p>
          </div>
        </div>

        {/* Commanding Category Menu Dock + Integrated Utility Bar */}
        <div className="rounded-xl bg-[#F3ECE0] border border-[#DFD4C2] p-2.5 space-y-2.5">
          <div
            role="tablist"
            aria-label="Danh mục thực đơn"
            className="flex flex-wrap items-center gap-1.5"
          >
            {MENU_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 min-h-[42px] rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C67211] ${
                    active
                      ? 'bg-[#24140D] text-[#FCFAF7] shadow-sm'
                      : 'bg-white/60 text-[#3E281D] hover:bg-white hover:text-[#24140D]'
                  }`}
                >
                  {cat.label}{' '}
                  <span
                    className={`font-mono tabular-nums text-xs ml-1 ${
                      active ? 'text-[#E5A952]' : 'text-[#7A6153]'
                    }`}
                  >
                    ({categoryCounts[cat.id]})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2.5 border-t border-[#E4D9C7] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 px-1 text-xs text-[#5A4336]">
              <span className="tabular-nums font-medium">
                Hiển thị {visibleItems.length} món trong thực đơn
              </span>
              {(searchQuery || selectedCategory !== 'all' || sortMode !== 'default') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-semibold text-[#9E5508] hover:underline cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <div className="relative">
                <label htmlFor="menu-sort" className="sr-only">
                  Sắp xếp thực đơn
                </label>
                <ArrowUpDown
                  className="w-4 h-4 text-[#7A6153] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  id="menu-sort"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as MenuSortMode)}
                  aria-label="Sắp xếp thực đơn"
                  className="w-full sm:w-48 pl-9 pr-3 py-2 min-h-[40px] rounded-lg border border-[#D8CCB8] bg-white text-sm font-medium text-[#24140D] focus:outline-none focus:border-[#C67211] cursor-pointer"
                >
                  <option value="default">Thứ tự mặc định</option>
                  <option value="featured">Món bán chạy</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                </select>
              </div>

              <div className="relative w-full sm:w-64">
                <label htmlFor="menu-search" className="sr-only">
                  Tìm món trong thực đơn
                </label>
                <Search
                  className="w-4 h-4 text-[#7A6153] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="menu-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bánh mì, cà phê, croissant..."
                  className="w-full pl-10 pr-4 py-2 min-h-[40px] rounded-lg border border-[#D8CCB8] bg-white text-sm text-[#24140D] placeholder:text-[#8E786B] focus:outline-none focus:border-[#C67211]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {visibleItems.length === 0 ? (
          <div className="mt-6 py-16 text-center rounded-xl border border-[#DFD4C2] bg-white">
            <p className="font-display text-xl font-bold text-[#24140D] mb-2">
              Không tìm thấy món phù hợp
            </p>
            <p className="text-sm text-[#5A4336] mb-5">
              Thử từ khóa khác như “pate”, “sữa đá” hoặc “croissant”.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 min-h-[42px] rounded-lg bg-[#24140D] text-white text-sm font-semibold hover:bg-[#3B2316] cursor-pointer"
            >
              Xem toàn bộ thực đơn
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((item) => {
              const wasJustAdded = justAddedId === item.id;
              return (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-xl border border-[#DFD4C2] bg-white overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-lg hover:border-[#C67211]/55"
                >
                  {/* Interactive culinary photography button opening detail/customization */}
                  <button
                    type="button"
                    onClick={() => onInspectItem(item)}
                    aria-label={`Xem chi tiết ${item.name}`}
                    className="relative aspect-[16/11] w-full overflow-hidden border-b border-[#EFE8DC] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C67211]"
                  >
                    {item.imageSrc ? (
                      <ArtisanImage
                        src={item.imageSrc}
                        alt={item.imageAlt || item.name}
                        imgClassName={item.imageClassName}
                        tone={item.imageTone}
                        fallbackArtworkKey={item.artworkKey}
                      />
                    ) : (
                      <ProductArtwork artworkKey={item.artworkKey} />
                    )}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pt-8 pb-2.5 bg-gradient-to-t from-[#1A0E08]/85 via-[#1A0E08]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between text-xs font-medium text-[#FCFAF7]"
                    >
                      <span>Xem chi tiết &amp; tùy chọn</span>
                      {item.options.length > 0 && (
                        <span className="font-mono tabular-nums text-[#E5A952]">
                          {item.options.length} lựa chọn
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Card content */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#6B5447] mb-1.5">
                        <span className="font-medium">{item.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{item.kcal}</span>
                        {item.featured && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#9E5508]">Bán chạy</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#24140D] leading-snug mb-1.5">
                        <button
                          type="button"
                          onClick={() => onInspectItem(item)}
                          className="text-left group-hover:text-[#9E5508] transition-colors cursor-pointer"
                        >
                          {item.name}
                        </button>
                      </h3>

                      <p className="text-sm text-[#5A4336] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-[#EFE8DC] flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono tabular-nums text-lg font-bold text-[#24140D]">
                          {formatVND(item.price)}
                        </p>
                        <p className="text-xs font-medium text-[#1E6B3A] leading-snug">
                          {item.prepNote}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.options.length > 0 && (
                          <button
                            type="button"
                            onClick={() => onInspectItem(item)}
                            aria-label={`Tùy chọn món ${item.name}`}
                            title="Tùy chọn món thêm"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#DFD4C2] text-[#4A3428] hover:bg-[#F3ECE0] hover:text-[#24140D] transition-colors cursor-pointer"
                          >
                            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCardQuickAdd(item)}
                          aria-label={`Thêm ${item.name} vào giỏ`}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[42px] rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            wasJustAdded
                              ? 'bg-[#1E6B3A] text-white'
                              : 'bg-[#24140D] text-[#FCFAF7] hover:bg-[#C67211]'
                          }`}
                        >
                          {wasJustAdded ? (
                            <>
                              <Check className="w-4 h-4" aria-hidden="true" />
                              <span>Đã thêm</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" aria-hidden="true" />
                              <span>Thêm</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
