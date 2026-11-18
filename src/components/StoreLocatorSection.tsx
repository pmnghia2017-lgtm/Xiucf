import React, { useMemo, useState } from 'react';
import { Check, Clock, MapPin, Phone, Search } from 'lucide-react';
import { CHAIN_DISTRICTS, STORE_BRANCHES, StoreBranch } from '../data/storeData';
import { filterStores } from '../utils/storeLogic';
import { ArtisanImage } from './ArtisanImage';

interface StoreLocatorSectionProps {
  activeBranchId: string;
  onSelectBranch: (branch: StoreBranch) => void;
  onOrderFromBranch: (branch: StoreBranch) => void;
}

const BRANCH_COORDS: Record<string, { x: number; y: number; shortLabel: string }> = {
  'phan-xich-long': { x: 132, y: 44, shortLabel: 'Phan Xích Long' },
  'd2-binh-thanh': { x: 266, y: 52, shortLabel: 'Nguyễn Gia Trí' },
  'cmt8-banco': { x: 96, y: 108, shortLabel: '179A CMT8' },
  'nguyen-dinh-chieu': { x: 158, y: 122, shortLabel: 'N. Đình Chiểu' },
  'hai-ba-trung': { x: 234, y: 124, shortLabel: 'Hai Bà Trưng' },
};

export const StoreLocatorSection: React.FC<StoreLocatorSectionProps> = ({
  activeBranchId,
  onSelectBranch,
  onOrderFromBranch,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = useMemo(
    () => filterStores(STORE_BRANCHES, selectedDistrict, searchQuery),
    [selectedDistrict, searchQuery]
  );

  const selectedBranch =
    STORE_BRANCHES.find((b) => b.id === activeBranchId) || STORE_BRANCHES[0];

  return (
    <section id="cua-hang" className="scroll-mt-16 py-16 lg:py-20 bg-[#F6F1E7] border-b border-[#E7DEC9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-[#C67211] mb-2">Hệ thống cửa hàng</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#24140D]">
              Tìm quầy Xíu gần bạn nhất
            </h2>
          </div>
          <p className="text-sm text-[#5A4336] max-w-md">
            Chọn chi nhánh trên danh sách hoặc sơ đồ khu vực để đặt trước nhận tại quầy hoặc giao nóng tận nơi.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div
            role="tablist"
            aria-label="Lọc cửa hàng theo quận"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EAE1D2] rounded-lg w-fit"
          >
            {CHAIN_DISTRICTS.map((district) => {
              const active = selectedDistrict === district;
              return (
                <button
                  key={district}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedDistrict(district)}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#24140D] shadow-xs'
                      : 'text-[#5A4336] hover:text-[#24140D]'
                  }`}
                >
                  {district}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <label htmlFor="store-search" className="sr-only">
              Tìm cửa hàng theo tên đường hoặc phường
            </label>
            <Search
              className="w-4 h-4 text-[#7A6153] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="store-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm đường, phường (vd: CMT8, Bàn Cờ)..."
              className="w-full pl-10 pr-4 py-2.5 min-h-[42px] rounded-lg border border-[#DFD4C2] bg-white text-sm text-[#24140D] placeholder:text-[#8E786B] focus:outline-none focus:border-[#C67211]"
            />
          </div>
        </div>

        {/* 2-column locator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Store list */}
          <div className="lg:col-span-7 space-y-3">
            {filteredBranches.length === 0 ? (
              <div className="p-8 rounded-xl border border-[#DFD4C2] bg-white text-center">
                <p className="text-base font-semibold text-[#24140D] mb-1">
                  Chưa có cửa hàng tại khu vực vừa tìm
                </p>
                <p className="text-sm text-[#5A4336] mb-4">
                  Hiện hệ thống tập trung tại Quận 1, Quận 3, Phú Nhuận và Bình Thạnh.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistrict('Tất cả');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#24140D] text-white text-sm font-medium cursor-pointer"
                >
                  Hiện tất cả 5 chi nhánh
                </button>
              </div>
            ) : (
              filteredBranches.map((branch) => {
                const isSelected = branch.id === selectedBranch.id;
                return (
                  <div
                    key={branch.id}
                    className={`rounded-xl border p-5 transition-colors bg-white ${
                      isSelected
                        ? 'border-[#C67211] ring-1 ring-[#C67211]/30'
                        : 'border-[#E2D6C3] hover:border-[#CBBBA3]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[#7A6153] mb-1">
                          <span>{branch.district}</span>
                          {branch.isFlagship && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-[#1E6B3A]">
                                Cửa hàng trung tâm
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-[#24140D]">
                          {branch.name}
                        </h3>

                        <p className="text-sm text-[#5A4336] mt-1">{branch.address}</p>

                        <p className="text-xs text-[#6B5447] mt-2 font-mono tabular-nums">
                          Mở cửa {branch.hours} · Điện thoại {branch.phone}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectBranch(branch)}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E6B3A] text-white'
                            : 'border border-[#D8CCB8] bg-[#FCFAF7] text-[#24140D] hover:bg-[#F3ECE0]'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4" aria-hidden="true" />}
                        <span>{isSelected ? 'Đang chọn' : 'Chọn chi nhánh'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Branch Details Panel + Interactive Schematic Map */}
          <aside className="lg:col-span-5 rounded-xl border border-[#DFD4C2] bg-white p-6 lg:sticky lg:top-24 space-y-5">
            {/* Editorial bakery counter interior window */}
            <div className="group aspect-[16/9] rounded-lg overflow-hidden border border-[#EAE1D2]">
              <ArtisanImage
                src="/assets/aistudio/pexels-ani-hadushaj-314140512-32459865_ab8ff529.jpg"
                alt="Không gian quầy gỗ ấm, tủ kính bánh ngọt và quầy pha chế cà phê tại cửa hàng Xíu"
                imgClassName="object-[50%_36%] origin-[50%_36%] scale-[1.18]"
                caption="Không gian quầy gỗ & tủ bánh tại cửa hàng"
              />
            </div>

            {/* Interactive HCMC branch schematic */}
            <div className="rounded-lg border border-[#EAE1D2] bg-[#FAF6EE] p-3">
              <div className="flex items-center justify-between text-xs text-[#6B5447] mb-2">
                <span className="font-medium text-[#24140D]">Sơ đồ kết nối TP.HCM</span>
                <span>Nhấp điểm để chọn quầy</span>
              </div>
              <svg
                viewBox="0 0 340 165"
                className="w-full h-auto rounded bg-[#F5EFE4]"
                role="img"
                aria-label="Sơ đồ 5 chi nhánh Xíu tại TP.HCM"
              >
                {/* Saigon River & Nhieu Loc canal stylized curves */}
                <path
                  d="M0 78 Q110 66 210 82 T340 72"
                  stroke="#D4E2DC"
                  strokeWidth="7"
                  fill="none"
                />
                <path
                  d="M285 0 Q300 85 270 165"
                  stroke="#D4E2DC"
                  strokeWidth="12"
                  fill="none"
                />

                {/* Arterial roads */}
                <line x1="65" y1="20" x2="125" y2="155" stroke="#E2D6C3" strokeWidth="2.5" />
                <line x1="55" y1="128" x2="275" y2="115" stroke="#E2D6C3" strokeWidth="2.5" />
                <line x1="185" y1="25" x2="260" y2="150" stroke="#E2D6C3" strokeWidth="2" />

                {/* District labels */}
                <text x="16" y="34" fill="#8C7464" fontSize="9" fontFamily="sans-serif">
                  Phú Nhuận
                </text>
                <text x="232" y="22" fill="#8C7464" fontSize="9" fontFamily="sans-serif">
                  Bình Thạnh
                </text>
                <text x="20" y="148" fill="#8C7464" fontSize="9" fontFamily="sans-serif">
                  Quận 3
                </text>
                <text x="235" y="152" fill="#8C7464" fontSize="9" fontFamily="sans-serif">
                  Quận 1
                </text>

                {/* Interactive Branch Pins */}
                {STORE_BRANCHES.map((branch) => {
                  const pt = BRANCH_COORDS[branch.id];
                  if (!pt) return null;
                  const active = branch.id === selectedBranch.id;
                  return (
                    <g
                      key={branch.id}
                      onClick={() => onSelectBranch(branch)}
                      className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-[#C67211]"
                      role="button"
                      tabIndex={0}
                      aria-label={`Chọn ${branch.name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectBranch(branch);
                        }
                      }}
                    >
                      {active && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="13"
                          fill="#C67211"
                          fillOpacity="0.18"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={active ? 7 : 5.5}
                        fill={active ? '#C67211' : branch.isFlagship ? '#1E6B3A' : '#24140D'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 11}
                        textAnchor="middle"
                        fill={active ? '#C67211' : '#24140D'}
                        fontSize={active ? '9.5' : '8.5'}
                        fontWeight={active ? '700' : '500'}
                        fontFamily="sans-serif"
                      >
                        {pt.shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div>
              <p className="text-xs font-medium text-[#C67211] mb-1">
                Thông tin chi nhánh đang chọn
              </p>
              <h3 className="font-display text-2xl font-bold text-[#24140D] mb-2">
                {selectedBranch.name}
              </h3>
              <p className="text-sm text-[#5A4336] leading-relaxed">
                {selectedBranch.note}
              </p>
            </div>

            <dl className="space-y-3.5 py-4 border-y border-[#EFE8DC] text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C67211] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-[#7A6153]">Địa chỉ đầy đủ</dt>
                  <dd className="font-medium text-[#24140D]">{selectedBranch.address}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C67211] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-[#7A6153]">Giờ mở cửa &amp; Lịch ra lò</dt>
                  <dd className="font-medium text-[#24140D] font-mono tabular-nums">
                    {selectedBranch.hours}
                  </dd>
                  <dd className="text-xs text-[#1E6B3A] mt-0.5 font-mono tabular-nums">
                    Ra lò bánh nóng: {selectedBranch.bakingSchedule}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C67211] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-[#7A6153]">Hotline quầy</dt>
                  <dd className="font-medium text-[#24140D] font-mono tabular-nums">
                    {selectedBranch.phone}
                  </dd>
                </div>
              </div>
            </dl>

            <div>
              <p className="text-xs text-[#7A6153] mb-1">Không gian &amp; Dịch vụ</p>
              <p className="text-sm text-[#24140D]">
                {selectedBranch.services.join(' · ')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOrderFromBranch(selectedBranch)}
              className="w-full py-3 px-5 min-h-[44px] rounded-lg bg-[#24140D] text-white text-sm font-semibold hover:bg-[#C67211] transition-colors cursor-pointer"
            >
              Đặt món tại {selectedBranch.name}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};
