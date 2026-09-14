import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Truck, 
  Tag, 
  Check 
} from 'lucide-react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PROMO_CODES } from '../data/products';
import { FREE_SHIPPING_THRESHOLD } from '../data/governorates';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  language,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (subtotal >= promo.minSpend) {
      if (promo.discountPercent) {
        discountAmount = Math.round((subtotal * promo.discountPercent) / 100);
      } else if (promo.discountFixed) {
        discountAmount = promo.discountFixed;
      }
    }
  }

  const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = onApplyPromo(promoInput.trim().toUpperCase());
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        id="cart-drawer-container"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2C1D11] text-[#FAF8F5] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#1A1A1A]">
                {t.cart} ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>
              <p className="text-[11px] text-[#8A7A6E]">
                {isAr ? 'عربة التسوق الآمنة مع المعاينة' : 'Secure Cart with Open Box Inspection'}
              </p>
            </div>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6B5E] hover:bg-[#EFE8DE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="p-3.5 bg-[#FAF5ED] border-b border-[#EADFCF] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#2C1D11]">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>
                {freeShippingLeft === 0
                  ? t.freeShippingAchieved
                  : isAr
                  ? `أضف بـ ${freeShippingLeft.toLocaleString()} ج.م للشحن المجاني 🚚`
                  : `Add ${freeShippingLeft} EGP for FREE shipping! 🚚`}
              </span>
            </div>
            <span className="text-[11px] text-[#8B5A2B]">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-[#E5D7C5] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#C5A059] to-[#8B5A2B] h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#F0EBE1]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#8A7A6E]">
                <ShoppingBag className="w-8 h-8 text-[#C5A059]" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#1A1A1A]">{t.emptyCart}</h4>
                <p className="text-xs text-[#8A7A6E] mt-1 max-w-xs">{t.emptyCartSub}</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#2C1D11] text-[#FAF8F5] text-xs font-bold hover:bg-[#3D2817] transition-all"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#E8E1D5] bg-[#FAF8F5]"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] truncate">
                    {isAr ? item.product.name : item.product.nameEn}
                  </h4>
                  
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#7A6B5E]">
                    <span className="px-2 py-0.5 rounded-md bg-[#F0EBE1] font-bold text-[#2C1D11]">
                      {t.size}: {item.selectedSize}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span>{isAr ? item.selectedColor.name : item.selectedColor.nameEn}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-xs sm:text-sm text-[#1C140E]">
                      {(item.product.price * item.quantity).toLocaleString()} {t.egp}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E0D7C9] rounded-lg bg-[#FAF8F5]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs text-[#2C1D11] hover:bg-[#EFE8DE] rounded-s"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-black text-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs text-[#2C1D11] hover:bg-[#EFE8DE] rounded-e"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-[#9A8E83] hover:text-[#A74127] transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E8E1D5] space-y-3">
            
            {/* Promo Code Input */}
            <form onSubmit={handlePromoSubmit} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={t.promoCodePlaceholder}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full bg-white border border-[#E0D7C9] rounded-xl py-2 px-3 pl-8 text-xs uppercase font-mono tracking-wider focus:outline-hidden focus:border-[#C5A059]"
                  />
                  <Tag className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-2.5 text-[#8A7A6E]" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2C1D11] text-[#FAF8F5] text-xs font-bold hover:bg-[#3D2817] transition-colors"
                >
                  {t.applyCode}
                </button>
              </div>

              {promoMessage && (
                <p className={`text-[11px] font-bold ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {promoMessage.text}
                </p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200">
                  <span className="font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    كود نشط: {appliedPromo} (-{discountAmount} ج.م)
                  </span>
                  <button
                    type="button"
                    onClick={onRemovePromo}
                    className="text-[10px] text-rose-600 underline font-bold"
                  >
                    إزالة
                  </button>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 pt-2 border-t border-[#E8E1D5] text-xs">
              <div className="flex justify-between text-[#5C4D42]">
                <span>{t.subtotal}</span>
                <span>{subtotal.toLocaleString()} {t.egp}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t.discount}</span>
                  <span>-{discountAmount.toLocaleString()} {t.egp}</span>
                </div>
              )}

              <div className="flex justify-between text-[#5C4D42]">
                <span>{t.shipping}</span>
                <span className={subtotal >= FREE_SHIPPING_THRESHOLD ? 'text-emerald-700 font-bold' : ''}>
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? t.freeShippingBadge : (isAr ? 'يُحسب عند إتمام الطلب' : 'Calculated at checkout')}
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-black text-[#1C140E] pt-2 border-t border-[#E8E1D5]">
                <span>{t.total}</span>
                <span>{(subtotal - discountAmount).toLocaleString()} {t.egp}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="drawer-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2C1D11] hover:bg-[#3D2817] text-[#FAF8F5] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <span>{t.checkout}</span>
              <ArrowIcon className="w-4 h-4 text-[#C5A059]" />
            </button>

            <p className="text-[10px] text-[#8A7A6E] text-center">
              ✓ الدفع عند الاستلام مع المعاينة متاح لجميع محافظات مصر
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
