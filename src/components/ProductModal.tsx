import React, { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { MenuItem } from '../data/storeData';
import { computeCartItemUnitPrice, formatVND } from '../utils/storeLogic';
import { ArtisanImage } from './ArtisanImage';
import { ProductArtwork } from './ProductArtwork';

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    selectedOptionIds: string[],
    note: string,
    quantity: number
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    setSelectedOptions([]);
    setQuantity(1);
    setNote('');
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const unitPrice = computeCartItemUnitPrice(item, selectedOptions);
  const totalPrice = unitPrice * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-[#FCFAF7] border border-[#E2D6C3] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="group relative h-60 sm:h-64 border-b border-[#E7DEC9] shrink-0">
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
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết món"
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-lg bg-white/95 border border-[#DFD4C2] flex items-center justify-center text-[#24140D] hover:bg-white cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <p className="text-xs text-[#7A6153] mb-1">
              {item.categoryLabel} · {item.kcal} · {item.prepNote}
            </p>
            <h3
              id="product-modal-title"
              className="font-display text-2xl font-bold text-[#24140D]"
            >
              {item.name}
            </h3>
            <p className="text-sm text-[#5A4336] mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {item.options.length > 0 && (
            <div className="pt-4 border-t border-[#E7DEC9]">
              <p className="text-sm font-semibold text-[#24140D] mb-3">
                Tùy chỉnh khẩu vị &amp; món thêm
              </p>
              <div className="space-y-2">
                {item.options.map((opt) => {
                  const checked = selectedOptions.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                        checked
                          ? 'border-[#C67211] bg-[#FDF7ED] text-[#24140D]'
                          : 'border-[#E7DEC9] bg-white text-[#5A4336] hover:border-[#D4C4AC]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOption(opt.id)}
                          className="w-4 h-4 accent-[#C67211]"
                        />
                        <span>{opt.label}</span>
                      </span>
                      <span className="font-mono tabular-nums text-xs font-medium text-[#24140D]">
                        {opt.priceDelta > 0 ? `+${formatVND(opt.priceDelta)}` : 'Miễn phí'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="item-note-input"
              className="block text-sm font-semibold text-[#24140D] mb-2"
            >
              Ghi chú cho quầy bếp
            </label>
            <input
              id="item-note-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Ít hành ngò, cắt đôi ổ bánh..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#DFD4C2] bg-white text-sm text-[#24140D] placeholder:text-[#8E786B] focus:outline-none focus:border-[#C67211]"
            />
          </div>
        </div>

        <div className="p-5 border-t border-[#E7DEC9] bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1 border border-[#DFD4C2] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Giảm số lượng"
              className="w-9 h-9 rounded-md flex items-center justify-center text-[#24140D] hover:bg-[#F3ECE0] cursor-pointer"
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="w-8 text-center font-mono tabular-nums text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Tăng số lượng"
              className="w-9 h-9 rounded-md flex items-center justify-center text-[#24140D] hover:bg-[#F3ECE0] cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onAddToCart(item, selectedOptions, note, quantity);
              onClose();
            }}
            className="flex-1 py-2.5 px-5 min-h-[44px] rounded-lg bg-[#C67211] text-white text-sm font-semibold hover:bg-[#AD610C] transition-colors tabular-nums cursor-pointer"
          >
            Thêm vào giỏ · {formatVND(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  );
};
