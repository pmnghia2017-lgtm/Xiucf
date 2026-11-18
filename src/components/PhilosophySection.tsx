import React, { useState } from 'react';
import { ArtisanImage } from './ArtisanImage';

const PRINCIPLES = [
  {
    number: '01.',
    title: 'Lò nướng liên tục mỗi 2 giờ tại từng cửa hàng',
    body: 'Bột mì tuyển chọn được ủ lạnh qua đêm và nướng trực tiếp tại quầy theo 4 khung giờ trong ngày. Ổ bánh luôn đạt độ giòn rụm vỏ ngoài và mềm xốp bên trong, không bán bánh qua ngày.',
    metric: '1.800+ ổ/ngày',
    metricNote: 'Sản lượng nướng tươi toàn chuỗi',
  },
  {
    number: '02.',
    title: 'Cà phê rang mộc 100% — không hương liệu, không độn bắp',
    body: 'Hạt Robusta chín cây từ Đắk Lắk và Arabica Cầu Đất được rang vừa độ để giữ hậu ngọt tự nhiên. Mỗi ly cà phê sữa đá hay Cold Brew đều xay mới và chiết xuất chuẩn định lượng.',
    metric: '18 giờ',
    metricNote: 'Thời gian ủ lạnh Cold Brew',
  },
  {
    number: '03.',
    title: 'Thực phẩm sạch & truy xuất nguồn gốc rõ ràng',
    body: 'Pate gan tươi chế biến mỗi sáng tại bếp trung tâm đạt chuẩn VSATTP, thịt heo và rau củ từ nông trại VietGAP, nói không với chất tẩy trắng bột mì và chất bảo quản.',
    metric: '100% VietGAP',
    metricNote: 'Rau củ, thịt nguội & trứng sạch',
  },
];

const BAKING_BATCHES = [
  {
    time: '05:30',
    label: 'Mẻ sáng sớm',
    items: 'Bánh mì vỏ giòn truyền thống · Pate gan tươi · Phin cà phê đầu ngày',
    note: 'Phục vụ cao điểm đi làm và học sinh từ 06:00',
  },
  {
    time: '08:30',
    label: 'Mẻ giữa buổi',
    items: 'Croissant bơ lạt Pháp · Pain au Chocolat · Thịt nướng sả ớt',
    note: 'Bổ sung bánh ngọt nóng cho khung giờ văn phòng',
  },
  {
    time: '11:30',
    label: 'Mẻ trưa',
    items: 'Bánh mì Đặc biệt · Gà xé bơ tỏi · Cold Brew cam vàng sả tươi',
    note: 'Sẵn sàng cho bữa trưa nhanh gọn & đơn giao nhóm',
  },
  {
    time: '15:30',
    label: 'Mẻ xế chiều',
    items: 'Bánh mì giòn mới · Bông lan trứng muối · Bánh ngọt ăn xế',
    note: 'Phục vụ giờ tan tầm và đặt tiệc Teabreak chiều',
  },
];

const KITCHEN_STANDARDS = [
  { label: 'Tần suất ra lò', value: 'Mỗi 2 giờ tại quầy' },
  { label: 'Nhiệt độ lò đối lưu', value: '215°C chuẩn vỏ giòn' },
  { label: 'Cam kết bánh mới', value: '100% bán trong ngày' },
  { label: 'Kiểm định bếp sáng', value: '04:30 hằng ngày' },
];

export const PhilosophySection: React.FC = () => {
  const [activeBatchIdx, setActiveBatchIdx] = useState(0);
  const currentBatch = BAKING_BATCHES[activeBatchIdx];

  return (
    <section
      id="triet-ly"
      className="scroll-mt-20 py-16 lg:py-20 bg-[#24140D] text-[#FCFAF7] border-y border-[#3B2316]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 lg:space-y-12">
        {/* Top band: Editorial thesis aligned with 3-frame triptych */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#E5A952] mb-2.5 tracking-wide">
              Triết lý vận hành chuỗi
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.15] tracking-tight text-white mb-4">
              Bánh mì tươi – Cà phê thật – Thực phẩm sạch
            </h2>
            <p className="text-base text-[#E2D6C5] leading-relaxed">
              Từ quầy bánh đầu tiên tại 179A Cách Mạng Tháng 8, Xíu đặt tiêu chuẩn
              nguyên liệu lên trước tốc độ mở rộng. Mọi chi nhánh đều tuân thủ quy
              trình nướng nóng tại chỗ và kiểm định bếp mỗi sáng.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="group aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden border border-[#472D20]">
                <ArtisanImage
                  src="/assets/aistudio/pexels-sevgi-2147957701-30510114_2d105ead.jpg"
                  alt="Tủ bánh mì vàng giòn mới ra lò xếp ngay ngắn dưới ánh đèn ấm tại quầy Xíu"
                  imgClassName="object-[64%_78%] origin-[64%_78%] scale-[1.34]"
                  tone="warm"
                  caption="Nướng nóng mỗi 2 giờ"
                />
              </div>
              <div className="group aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden border border-[#472D20]">
                <ArtisanImage
                  src="/assets/aistudio/Vietnamese_iced_coffee_-_Jan_31__2018_6e1fe1d1.jpg"
                  alt="Phin nhôm truyền thống đang nhỏ từng giọt cà phê nguyên chất trên mặt bàn gỗ"
                  imgClassName="object-[50%_46%]"
                  tone="warm"
                  caption="Chiết xuất phin chậm"
                />
              </div>
              <div className="group aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden border border-[#472D20]">
                <ArtisanImage
                  src="/assets/aistudio/pexels-felipe-vieira-651921657-20066398_bd232780.jpg"
                  alt="Tách cà phê rang mộc lớp crema dày đặt giữa hạt cà phê nguyên chất trên nền gỗ"
                  imgClassName="object-[50%_50%]"
                  tone="warm"
                  caption="100% hạt rang mộc"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom band: Equal-height interactive oven schedule & 3 numbered pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-xl border border-[#472D20] bg-[#2D1A11] p-6 flex flex-col justify-between gap-5">
              <div>
                <p className="text-xs font-medium text-[#E5A952] mb-3">
                  Lịch ra lò bánh nóng hằng ngày
                </p>
                <div
                  role="tablist"
                  aria-label="Chọn khung giờ ra lò"
                  className="grid grid-cols-4 gap-1.5 mb-4"
                >
                  {BAKING_BATCHES.map((batch, idx) => {
                    const selected = idx === activeBatchIdx;
                    return (
                      <button
                        key={batch.time}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActiveBatchIdx(idx)}
                        className={`py-2 px-2 rounded-md font-mono tabular-nums text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A952] ${
                          selected
                            ? 'bg-[#C67211] text-white'
                            : 'bg-[#24140D] text-[#D7C8B7] hover:bg-[#3A2216]'
                        }`}
                      >
                        {batch.time}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-lg bg-[#24140D]/75 border border-[#3E261A] p-4 space-y-2">
                  <p className="text-base font-semibold text-white">
                    {currentBatch.label} ({currentBatch.time})
                  </p>
                  <p className="text-sm text-[#E2D6C5] leading-relaxed">
                    {currentBatch.items}
                  </p>
                  <p className="text-xs text-[#77C992] pt-0.5">{currentBatch.note}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#472D20]">
                <p className="text-xs font-medium text-[#E5A952] mb-3">
                  Tiêu chuẩn kiểm soát quầy
                </p>
                <dl className="divide-y divide-[#3B2316] text-xs">
                  {KITCHEN_STANDARDS.map((std) => (
                    <div
                      key={std.label}
                      className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <dt className="text-[#B9A794]">{std.label}</dt>
                      <dd className="font-mono tabular-nums font-medium text-[#F5EDE1] text-right">
                        {std.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex">
            <div className="w-full divide-y divide-[#472D20] border-y border-[#472D20] flex flex-col justify-between">
              {PRINCIPLES.map((item) => (
                <div
                  key={item.number}
                  className="py-5 first:pt-5 last:pb-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start"
                >
                  <div className="sm:col-span-8 flex items-start gap-3">
                    <span className="font-mono text-base font-semibold text-[#E5A952] pt-0.5 shrink-0">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white leading-snug mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#D7C8B7] leading-relaxed">{item.body}</p>
                    </div>
                  </div>

                  <div className="sm:col-span-4 sm:text-right pl-8 sm:pl-0">
                    <p className="font-mono tabular-nums text-lg font-semibold text-[#77C992]">
                      {item.metric}
                    </p>
                    <p className="text-xs text-[#B9A794] mt-1 leading-relaxed">
                      {item.metricNote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
