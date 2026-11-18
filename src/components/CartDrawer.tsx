import React, { useEffect, useState } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { MENU_ITEMS, MenuItem, STORE_BRANCHES } from '../data/storeData';
import {
  CartItem,
  FREE_DELIVERY_THRESHOLD,
  FulfillmentMode,
  calculateOrderSummary,
  computeCartItemUnitPrice,
  formatVND,
  validateCheckoutForm,
} from '../utils/storeLogic';
import { submitOrder } from '../utils/apiClient';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  activeBranchId: string;
  onChangeBranchId: (id: string) => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onQuickAddItem: (item: MenuItem) => void;
  onClearCart: () => void;
}

interface ConfirmedReceipt {
  orderCode: string;
  customerName: string;
  phone: string;
  branchName: string;
  fulfillment: FulfillmentMode;
  address: string;
  total: number;
  itemCount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  cartItems,
  activeBranchId,
  onChangeBranchId,
  onUpdateQuantity,
  onRemoveItem,
  onQuickAddItem,
  onClearCart,
}) => {
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>('pickup');
  const [promoCode, setPromoCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ConfirmedReceipt | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const summary = calculateOrderSummary(cartItems, fulfillment, promoCode);
  const selectedBranch =
    STORE_BRANCHES.find((b) => b.id === activeBranchId) || STORE_BRANCHES[0];

  const hasBread = cartItems.some((c) => c.item.category === 'banh-mi');
  const hasCoffee = cartItems.some((c) => c.item.category === 'ca-phe');
  const suggestedCoffee = MENU_ITEMS.find((i) => i.id === 'cp-sua-da');
  const suggestedBread = MENU_ITEMS.find((i) => i.id === 'bm-dac-biet');
  const pairingSuggestion =
    hasBread && !hasCoffee
      ? suggestedCoffee
      : hasCoffee && !hasBread
        ? suggestedBread
        : undefined;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm({
      customerName,
      phone,
      address,
      fulfillment,
      branchId: activeBranchId,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    const itemsPayload = cartItems.map((entry) => ({
      itemId: entry.item.id,
      name: entry.item.name,
      quantity: entry.quantity,
      unitPrice: computeCartItemUnitPrice(entry.item, entry.selectedOptionIds),
      options: entry.item.options
        .filter((o) => entry.selectedOptionIds.includes(o.id))
        .map((o) => o.label),
      note: entry.note,
    }));

    const result = await submitOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      fulfillment,
      branchId: activeBranchId,
      branchName: selectedBranch.name,
      promoCode: promoCode.trim().toUpperCase(),
      subtotal: summary.subtotal,
      discount: summary.comboDiscount,
      deliveryFee: summary.deliveryFee,
      total: summary.total,
      totalItems: summary.totalItems,
      items: itemsPayload,
    });

    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(
        result.errorMessage || 'Không thể gửi đơn hàng. Vui lòng thử lại.'
      );
      return;
    }

    setReceipt({
      orderCode: result.code,
      customerName: customerName.trim(),
      phone: phone.trim(),
      branchName: selectedBranch.name,
      fulfillment,
      address: address.trim(),
      total: summary.total,
      itemCount: summary.totalItems,
    });
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FCFAF7] h-full shadow-2xl border-l border-[#E2D6C3] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7DEC9] bg-white flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 id="cart-drawer-title" className="font-display text-xl font-bold text-[#24140D]">
              Giỏ hàng của bạn
            </h2>
            <p className="text-xs text-[#6B5447] tabular-nums">
              {summary.totalItems > 0
                ? `${summary.totalItems} món · ${selectedBranch.name}`
                : selectedBranch.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng giỏ hàng"
            className="w-10 h-10 rounded-lg border border-[#E2D6C3] flex items-center justify-center text-[#24140D] hover:bg-[#F5EFE4] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {receipt ? (
            <div className="rounded-xl border border-[#1E6B3A]/30 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-[#1E6B3A]">
                <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
                <h3 className="font-display text-2xl font-bold text-[#24140D]">
                  Đặt hàng thành công
                </h3>
              </div>
              <p className="text-sm text-[#5A4336] leading-relaxed">
                Quầy bếp tại <span className="font-semibold text-[#24140D]">{receipt.branchName}</span>{' '}
                đang chuẩn bị <span className="tabular-nums font-medium">{receipt.itemCount}</span> món tươi nóng cho{' '}
                <span className="font-semibold text-[#24140D]">{receipt.customerName}</span>.
              </p>

              <dl className="py-4 border-y border-[#EFE8DC] space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#6B5447]">Mã đơn hàng</dt>
                  <dd className="font-mono font-semibold text-[#24140D]">#{receipt.orderCode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6B5447]">Hình thức</dt>
                  <dd className="font-medium text-[#24140D]">
                    {receipt.fulfillment === 'pickup' ? 'Nhận tại quầy (15 phút)' : 'Giao tận nơi'}
                  </dd>
                </div>
                {receipt.fulfillment === 'delivery' && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#6B5447] shrink-0">Địa chỉ</dt>
                    <dd className="font-medium text-[#24140D] text-right">{receipt.address}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#6B5447]">Tổng thanh toán (COD/Tiền mặt)</dt>
                  <dd className="font-mono tabular-nums font-bold text-[#C67211]">
                    {formatVND(receipt.total)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#24140D] text-white text-sm font-semibold hover:bg-[#3B2316] cursor-pointer"
              >
                Tiếp tục khám phá thực đơn
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-semibold text-[#24140D] mb-2">
                Giỏ hàng đang trống
              </p>
              <p className="text-sm text-[#5A4336] mb-6">
                Hãy chọn ổ bánh mì nóng giòn hoặc ly cà phê phin đậm vị từ thực đơn.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-[#C67211] text-white text-sm font-semibold hover:bg-[#AD610C] cursor-pointer"
              >
                Xem thực đơn ngay
              </button>
            </div>
          ) : (
            <>
              {/* Item list */}
              <ul className="divide-y divide-[#E7DEC9] border-b border-[#E7DEC9]">
                {cartItems.map((entry) => {
                  const unitPrice = computeCartItemUnitPrice(
                    entry.item,
                    entry.selectedOptionIds
                  );
                  const optionLabels = entry.item.options
                    .filter((o) => entry.selectedOptionIds.includes(o.id))
                    .map((o) => o.label);

                  return (
                    <li key={entry.cartKey} className="py-4 first:pt-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#24140D]">
                            {entry.item.name}
                          </p>
                          {optionLabels.length > 0 && (
                            <p className="text-xs text-[#6B5447] mt-0.5">
                              {optionLabels.join(' · ')}
                            </p>
                          )}
                          {entry.note && (
                            <p className="text-xs text-[#7A6153] italic mt-0.5">
                              Ghi chú: {entry.note}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(entry.cartKey)}
                          aria-label={`Xóa ${entry.item.name}`}
                          className="p-1.5 text-[#7A6153] hover:text-[#B42318] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#DFD4C2] rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.cartKey, -1)}
                            aria-label={`Giảm số lượng ${entry.item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-[#24140D] hover:bg-[#F5EFE4] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center font-mono tabular-nums text-xs font-semibold">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.cartKey, 1)}
                            aria-label={`Tăng số lượng ${entry.item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-[#24140D] hover:bg-[#F5EFE4] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <p className="font-mono tabular-nums text-sm font-semibold text-[#24140D]">
                          {formatVND(unitPrice * entry.quantity)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Smart pairing suggestion to unlock -8% */}
              {pairingSuggestion && (
                <div className="rounded-lg border border-[#E2D6C3] bg-[#F6F1E7] p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1E6B3A]">
                      Ghép cặp Bánh mì &amp; Cà phê để giảm 8%
                    </p>
                    <p className="text-xs text-[#5A4336] truncate mt-0.5">
                      Thêm {pairingSuggestion.name} ({formatVND(pairingSuggestion.price)})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onQuickAddItem(pairingSuggestion)}
                    className="px-3 py-1.5 rounded-md bg-[#24140D] text-white text-xs font-medium hover:bg-[#C67211] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    + Thêm
                  </button>
                </div>
              )}

              {/* Promo Code */}
              <div>
                <label
                  htmlFor="promo-code-input"
                  className="block text-xs font-medium text-[#5A4336] mb-1.5"
                >
                  Mã ưu đãi (nhập <span className="font-mono font-semibold">XIU10</span> giảm 10%)
                </label>
                <input
                  id="promo-code-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã ưu đãi nếu có..."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#DFD4C2] bg-white text-sm font-mono uppercase text-[#24140D] placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#C67211]"
                />
              </div>

              {/* Order calculation breakdown */}
              <div className="rounded-xl border border-[#E7DEC9] bg-white p-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#5A4336]">
                  <span>Tạm tính</span>
                  <span className="font-mono tabular-nums">{formatVND(summary.subtotal)}</span>
                </div>

                {summary.comboDiscount > 0 && (
                  <div className="flex justify-between text-[#1E6B3A]">
                    <span>{summary.discountReason}</span>
                    <span className="font-mono tabular-nums">
                      -{formatVND(summary.comboDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#5A4336]">
                  <span>Phí giao hàng</span>
                  <span className="font-mono tabular-nums">
                    {summary.deliveryFee === 0 ? 'Miễn phí' : formatVND(summary.deliveryFee)}
                  </span>
                </div>

                {fulfillment === 'delivery' && summary.freeDeliveryRemaining > 0 && (
                  <p className="text-xs text-[#7A6153]">
                    Mua thêm {formatVND(summary.freeDeliveryRemaining)} để được miễn phí giao hàng (đơn từ {formatVND(FREE_DELIVERY_THRESHOLD)}).
                  </p>
                )}

                <div className="pt-2 border-t border-[#EFE8DC] flex justify-between font-semibold text-base text-[#24140D]">
                  <span>Tổng thanh toán</span>
                  <span className="font-mono tabular-nums text-[#C67211]">
                    {formatVND(summary.total)}
                  </span>
                </div>
              </div>

              {/* Checkout form */}
              <form id="checkout-form" onSubmit={handleCheckout} noValidate className="space-y-4">
                <div>
                  <span className="block text-xs font-medium text-[#5A4336] mb-1.5">
                    Hình thức nhận món
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EAE1D2] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setFulfillment('pickup')}
                      className={`py-2 px-3 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                        fulfillment === 'pickup'
                          ? 'bg-white text-[#24140D] shadow-xs'
                          : 'text-[#5A4336]'
                      }`}
                    >
                      Nhận tại quầy
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillment('delivery')}
                      className={`py-2 px-3 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                        fulfillment === 'delivery'
                          ? 'bg-white text-[#24140D] shadow-xs'
                          : 'text-[#5A4336]'
                      }`}
                    >
                      Giao tận nơi
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-branch"
                    className="block text-xs font-medium text-[#5A4336] mb-1.5"
                  >
                    Chi nhánh phục vụ
                  </label>
                  <select
                    id="checkout-branch"
                    value={activeBranchId}
                    onChange={(e) => onChangeBranchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD4C2] bg-white text-sm text-[#24140D] focus:outline-none focus:border-[#C67211]"
                  >
                    {STORE_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.ward}, {b.district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-medium text-[#5A4336] mb-1.5"
                  >
                    Tên người nhận <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Trần Thị Minh Thư"
                    aria-invalid={Boolean(errors.customerName)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD4C2] bg-white text-sm text-[#24140D] focus:outline-none focus:border-[#C67211]"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-[#B42318] mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-[#5A4336] mb-1.5"
                  >
                    Số điện thoại <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0908123456"
                    aria-invalid={Boolean(errors.phone)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD4C2] bg-white text-sm font-mono text-[#24140D] focus:outline-none focus:border-[#C67211]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#B42318] mt-1">{errors.phone}</p>
                  )}
                </div>

                {fulfillment === 'delivery' && (
                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs font-medium text-[#5A4336] mb-1.5"
                    >
                      Địa chỉ giao hàng <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, phường, quận..."
                      aria-invalid={Boolean(errors.address)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD4C2] bg-white text-sm text-[#24140D] focus:outline-none focus:border-[#C67211]"
                    />
                    {errors.address && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.address}</p>
                    )}
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer CTA */}
        {!receipt && cartItems.length > 0 && (
          <div className="p-5 border-t border-[#E7DEC9] bg-white shrink-0 space-y-2.5">
            {submitError && (
              <p role="alert" className="text-xs text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-lg px-3 py-2">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full py-3 px-5 min-h-[44px] rounded-lg bg-[#C67211] text-white text-sm font-semibold hover:bg-[#AD610C] disabled:opacity-65 disabled:cursor-wait transition-colors tabular-nums cursor-pointer"
            >
              {submitting
                ? 'Đang gửi đơn hàng...'
                : `Xác nhận đặt món · ${formatVND(summary.total)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
