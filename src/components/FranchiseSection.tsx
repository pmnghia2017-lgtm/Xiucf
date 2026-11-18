import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FranchiseInput, validateFranchiseForm } from '../utils/storeLogic';
import { submitInquiry } from '../utils/apiClient';
import { ArtisanImage } from './ArtisanImage';

export const FranchiseSection: React.FC = () => {
  const [form, setForm] = useState<FranchiseInput>({
    fullName: '',
    phone: '',
    area: '',
    inquiryType: 'nhuong-quyen',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateFranchiseForm(form);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    const apiResult = await submitInquiry(form);
    setSubmitting(false);

    if (!apiResult.ok) {
      setSubmitError(
        apiResult.errorMessage || 'Không thể gửi hồ sơ lúc này. Vui lòng thử lại.'
      );
      return;
    }

    setSubmittedRef(apiResult.code);
  };

  const resetForm = () => {
    setForm({
      fullName: '',
      phone: '',
      area: '',
      inquiryType: 'nhuong-quyen',
      notes: '',
    });
    setErrors({});
    setSubmittedRef(null);
  };

  return (
    <section id="nhuong-quyen" className="scroll-mt-16 py-16 lg:py-20 bg-[#FCFAF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left column: Chain partnership overview */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#C67211] mb-2">
              Phát triển chuỗi &amp; B2B
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#24140D] mb-4">
              Nhượng quyền cửa hàng &amp; Đặt tiệc doanh nghiệp
            </h2>
            <p className="text-base text-[#5A4336] leading-relaxed mb-6">
              Xíu Bread &amp; Coffee đồng bộ từ thiết kế quầy gỗ ấm, máy nướng đối lưu,
              nguồn bột ủ chuẩn hóa đến cà phê rang xay riêng cho đối tác nhượng quyền
              và các đơn hàng Teabreak văn phòng từ 20 phần trở lên.
            </p>

            <div className="group aspect-[16/9] rounded-xl overflow-hidden border border-[#E7DEC9] mb-6">
              <ArtisanImage
                src="/assets/aistudio/pexels-aleksey-nosov-81016902-11132931_011c54a9.jpg"
                alt="Bánh mì lát giòn kèm thịt nguội, rau xanh và ly cà phê nóng phục vụ trên khay gỗ dưới nắng sớm"
                imgClassName="object-[50%_62%] origin-[50%_62%] scale-[1.08]"
                caption="Tiêu chuẩn Teabreak & phục vụ đồng bộ tại quầy"
              />
            </div>

            <div className="divide-y divide-[#E7DEC9] border-t border-b border-[#E7DEC9] text-sm">
              <div className="py-4 flex items-baseline justify-between gap-4">
                <span className="font-medium text-[#24140D]">Mô hình Kiosk / Mang đi</span>
                <span className="font-mono tabular-nums text-[#5A4336]">18 – 25 m²</span>
              </div>
              <div className="py-4 flex items-baseline justify-between gap-4">
                <span className="font-medium text-[#24140D]">Mô hình Flagship tại chỗ</span>
                <span className="font-mono tabular-nums text-[#5A4336]">45 – 80 m²</span>
              </div>
              <div className="py-4 flex items-baseline justify-between gap-4">
                <span className="font-medium text-[#24140D]">Đặt tiệc Teabreak / Hội nghị</span>
                <span className="font-mono tabular-nums text-[#1E6B3A]">Từ 20 phần</span>
              </div>
            </div>
          </div>

          {/* Right column: Validated Inquiry Form */}
          <div className="lg:col-span-7 rounded-xl border border-[#E2D6C3] bg-white p-6 sm:p-8">
            {submittedRef ? (
              <div className="py-6">
                <div className="flex items-center gap-3 text-[#1E6B3A] mb-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-bold text-[#24140D]">
                    Đã ghi nhận yêu cầu hợp tác
                  </h3>
                </div>
                <p className="text-sm text-[#5A4336] leading-relaxed mb-5">
                  Cảm ơn <span className="font-semibold text-[#24140D]">{form.fullName}</span>.
                  Bộ phận phát triển chuỗi Xíu sẽ liên hệ qua số{' '}
                  <span className="font-mono tabular-nums font-semibold text-[#24140D]">
                    {form.phone}
                  </span>{' '}
                  trong vòng 24 giờ làm việc.
                </p>
                <div className="p-4 rounded-lg bg-[#F6F1E7] border border-[#E7DEC9] text-sm space-y-1 mb-6">
                  <p>
                    Mã hồ sơ:{' '}
                    <span className="font-mono font-semibold text-[#24140D]">
                      #{submittedRef}
                    </span>
                  </p>
                  <p className="text-[#5A4336]">
                    Khu vực: {form.area}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-lg border border-[#D8CCB8] text-sm font-medium text-[#24140D] hover:bg-[#F5EFE4] cursor-pointer"
                >
                  Gửi thêm yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#24140D]">
                    Đăng ký nhận hồ sơ &amp; báo giá
                  </h3>
                  <p className="text-sm text-[#5A4336] mt-1">
                    Điền thông tin bên dưới để nhận bảng dự toán đầu tư hoặc thực đơn tiệc văn phòng.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="franchise-name"
                      className="block text-sm font-medium text-[#24140D] mb-1.5"
                    >
                      Họ và tên / Đơn vị <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="franchise-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Nguyễn Văn An"
                      aria-invalid={Boolean(errors.fullName)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg border border-[#DFD4C2] bg-[#FCFAF7] text-sm text-[#24140D] focus:outline-none focus:border-[#C67211]"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="franchise-phone"
                      className="block text-sm font-medium text-[#24140D] mb-1.5"
                    >
                      Số điện thoại <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="franchise-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0909123456"
                      aria-invalid={Boolean(errors.phone)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg border border-[#DFD4C2] bg-[#FCFAF7] text-sm text-[#24140D] font-mono focus:outline-none focus:border-[#C67211]"
                    />
                    {errors.phone && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="franchise-area"
                      className="block text-sm font-medium text-[#24140D] mb-1.5"
                    >
                      Quận / Tỉnh thành dự kiến <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="franchise-area"
                      type="text"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      placeholder="Quận 3, TP.HCM"
                      aria-invalid={Boolean(errors.area)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg border border-[#DFD4C2] bg-[#FCFAF7] text-sm text-[#24140D] focus:outline-none focus:border-[#C67211]"
                    />
                    {errors.area && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.area}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="franchise-type"
                      className="block text-sm font-medium text-[#24140D] mb-1.5"
                    >
                      Hình thức quan tâm
                    </label>
                    <select
                      id="franchise-type"
                      value={form.inquiryType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          inquiryType: e.target.value as FranchiseInput['inquiryType'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg border border-[#DFD4C2] bg-[#FCFAF7] text-sm text-[#24140D] focus:outline-none focus:border-[#C67211]"
                    >
                      <option value="nhuong-quyen">Nhượng quyền cửa hàng Xíu</option>
                      <option value="teabreak">Đặt tiệc Teabreak văn phòng</option>
                      <option value="cung-cap-si">Cung cấp sỉ bánh mì tươi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="franchise-notes"
                    className="block text-sm font-medium text-[#24140D] mb-1.5"
                  >
                    Ghi chú mặt bằng hoặc số lượng phần ăn
                  </label>
                  <textarea
                    id="franchise-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Ví dụ: Đang có mặt bằng góc 2 mặt tiền 40m² tại Tân Bình, hoặc cần 50 phần bánh mì + cà phê sáng thứ Sáu..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD4C2] bg-[#FCFAF7] text-sm text-[#24140D] focus:outline-none focus:border-[#C67211]"
                  />
                </div>

                {submitError && (
                  <p role="alert" className="text-xs text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-lg px-3 py-2">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-lg bg-[#C67211] text-white text-sm font-semibold hover:bg-[#AD610C] disabled:opacity-65 disabled:cursor-wait transition-colors cursor-pointer"
                >
                  {submitting ? 'Đang gửi thông tin...' : 'Gửi thông tin liên hệ'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
