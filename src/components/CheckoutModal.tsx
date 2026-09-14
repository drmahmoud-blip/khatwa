import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  QrCode
} from 'lucide-react';
import { CartItem, Language, PaymentMethod, OrderCustomerInfo, Order } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { EGYPT_GOVERNORATES, FREE_SHIPPING_THRESHOLD } from '../data/governorates';
import { PROMO_CODES } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  items: CartItem[];
  appliedPromo: string | null;
  onCompleteOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  language,
  items,
  appliedPromo,
  onCompleteOrder,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [altPhoneNumber, setAltPhoneNumber] = useState('');
  const [governorateId, setGovernorateId] = useState('cairo');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected Governorate
  const selectedGov = EGYPT_GOVERNORATES.find((g) => g.id === governorateId) || EGYPT_GOVERNORATES[0];

  // Pricing calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

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

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : selectedGov.shippingCost;
  const total = subtotal - discountAmount + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate Egyptian phone number format (must start with 01 and have 11 digits)
    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    const phoneRegex = /^01[0125][0-9]{8}$/;

    if (!cleanPhone.match(phoneRegex)) {
      setErrorMsg(isAr ? 'يرجى إدخال رقم هاتف محمول مصري صحيح مكون من 11 رقم (010 / 011 / 012 / 015)' : 'Please enter a valid 11-digit Egyptian phone number starting with 01');
      return;
    }

    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setErrorMsg(isAr ? 'يرجى إدخال الاسم ثنائي أو ثلاثي على الأقل' : 'Please enter your full name');
      return;
    }

    if (!address.trim() || address.trim().length < 6) {
      setErrorMsg(isAr ? 'يرجى كتابة العنوان بالتفصيل لضمان سرعة الوصول' : 'Please write your full detailed street address');
      return;
    }

    setSubmitting(true);

    const customerInfo: OrderCustomerInfo = {
      fullName: fullName.trim(),
      phoneNumber: cleanPhone,
      altPhoneNumber: altPhoneNumber.trim() || undefined,
      governorateId,
      city: city.trim() || selectedGov.nameAr,
      address: address.trim(),
      notes: notes.trim() || undefined,
    };

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `KTW-${randomSuffix}`,
      items: [...items],
      customer: customerInfo,
      paymentMethod,
      subtotal,
      discount: discountAmount,
      shippingCost,
      total,
      promoCode: appliedPromo || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      trackingNumber: `EG-${randomSuffix}-X`,
      estimatedDelivery: selectedGov.deliveryDays,
    };

    setTimeout(() => {
      setSubmitting(false);
      onCompleteOrder(newOrder);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="checkout-modal"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8E1D5] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2C1D11] text-[#FAF8F5] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#1A1A1A]">
                {t.checkoutTitle}
              </h3>
              <p className="text-xs text-[#8A7A6E]">
                {isAr ? 'شحن سريع لجميع محافظات مصر مع ميزة المعاينة قبل الاستلام' : 'Fast delivery with open box inspection guarantee'}
              </p>
            </div>
          </div>
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6B5E] hover:bg-[#EFE8DE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer & Address */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#2C1D11] flex items-center gap-2 border-b border-[#F0EBE1] pb-2">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>{t.step1Title}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {t.fullName} *
                </label>
                <input
                  id="checkout-fullname-input"
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: أحمد محمد علي' : 'e.g. Ahmed Mohamed'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl p-2.5 text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {t.phoneNumber} *
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  required
                  placeholder={t.phonePlaceholder}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl p-2.5 text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>

              {/* Governorate Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {t.governorate} *
                </label>
                <select
                  id="checkout-governorate-select"
                  value={governorateId}
                  onChange={(e) => setGovernorateId(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl p-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
                >
                  {EGYPT_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {isAr ? gov.nameAr : gov.nameEn} ({gov.shippingCost} {t.egp} - {gov.deliveryDays})
                    </option>
                  ))}
                </select>
              </div>

              {/* City / District */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {t.cityArea} *
                </label>
                <input
                  id="checkout-city-input"
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: مدينة نصر / سموحة / طنطا ثان' : 'e.g. Nasr City / Smouha'}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl p-2.5 text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                {t.addressDetails} *
              </label>
              <textarea
                id="checkout-address-input"
                required
                rows={2}
                placeholder={isAr ? 'اسم الشارع، رقم العمارة، الدور، رقم الشقة، علامة مميزة' : 'Street name, building number, apartment'}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl p-2.5 text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
              />
            </div>

            {/* Alternative Phone & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {t.altPhone}
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={altPhoneNumber}
                  onChange={(e) => setAltPhoneNumber(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl p-2.5 text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {t.orderNotes}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: يرجي الاتصال قبل المجيء بساعة' : 'Delivery notes for courier'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl p-2.5 text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Methods */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-black text-[#2C1D11] flex items-center gap-2 border-b border-[#F0EBE1] pb-2">
              <Banknote className="w-4 h-4 text-[#C5A059]" />
              <span>{t.paymentOptions}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: Cash On Delivery (Most Popular in Egypt) */}
              <label 
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#2C1D11] bg-[#FAF5ED] ring-2 ring-[#C5A059]/40'
                    : 'border-[#E0D7C9] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-black text-xs text-[#1A1A1A]">
                    <Banknote className="w-4 h-4 text-[#C5A059]" />
                    <span>{t.cod}</span>
                    <span className="text-[9px] bg-emerald-700 text-white font-bold px-1.5 py-0.2 rounded-sm">
                      الأكثر طلباً
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6B5E] leading-relaxed">
                    {t.codDesc}
                  </p>
                </div>
              </label>

              {/* Option 2: InstaPay */}
              <label 
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'instapay'
                    ? 'border-[#2C1D11] bg-[#FAF5ED] ring-2 ring-[#C5A059]/40'
                    : 'border-[#E0D7C9] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'instapay'}
                  onChange={() => setPaymentMethod('instapay')}
                  className="mt-1"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-black text-xs text-[#1A1A1A]">
                    <QrCode className="w-4 h-4 text-purple-700" />
                    <span>{t.instapay}</span>
                  </div>
                  <p className="text-[11px] text-[#7A6B5E] leading-relaxed">
                    {t.instapayDesc}
                  </p>
                </div>
              </label>

              {/* Option 3: Vodafone Cash & Wallets */}
              <label 
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'vodafone_cash'
                    ? 'border-[#2C1D11] bg-[#FAF5ED] ring-2 ring-[#C5A059]/40'
                    : 'border-[#E0D7C9] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'vodafone_cash'}
                  onChange={() => setPaymentMethod('vodafone_cash')}
                  className="mt-1"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-black text-xs text-[#1A1A1A]">
                    <Smartphone className="w-4 h-4 text-red-600" />
                    <span>{t.vodafoneCash}</span>
                  </div>
                  <p className="text-[11px] text-[#7A6B5E] leading-relaxed">
                    {t.vodafoneCashDesc}
                  </p>
                </div>
              </label>

              {/* Option 4: Card / Meeza */}
              <label 
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#2C1D11] bg-[#FAF5ED] ring-2 ring-[#C5A059]/40'
                    : 'border-[#E0D7C9] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-black text-xs text-[#1A1A1A]">
                    <CreditCard className="w-4 h-4 text-blue-700" />
                    <span>{t.card}</span>
                  </div>
                  <p className="text-[11px] text-[#7A6B5E] leading-relaxed">
                    {t.cardDesc}
                  </p>
                </div>
              </label>

            </div>

            {/* InstaPay / Vodafone info box if selected */}
            {paymentMethod === 'instapay' && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
                <span className="font-bold block">معلومات تحويل إنستاباي:</span>
                <p className="font-mono text-sm font-bold text-purple-950">IPA: khatwa.shoes@instapay</p>
                <p className="text-[11px] text-purple-800">أو رقم الموبايل: 01023456789 (باسم: شركة خطوة فوتوير)</p>
              </div>
            )}
            {paymentMethod === 'vodafone_cash' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
                <span className="font-bold block">رقم تحويل محفظة فودافون كاش:</span>
                <p className="font-mono text-sm font-bold text-red-950">01098765432</p>
                <p className="text-[11px] text-red-800">يتم إرسال رسالة التأكيد بعد إتمام الطلب مباشرة</p>
              </div>
            )}
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2 text-xs">
            <h5 className="font-bold text-[#1A1A1A] pb-1 border-b border-[#E8E1D5]">
              {t.orderSummary} ({items.length} {t.itemsCount})
            </h5>
            
            <div className="space-y-1 text-[#5C4D42]">
              <div className="flex justify-between">
                <span>{t.subtotal}:</span>
                <span>{subtotal.toLocaleString()} {t.egp}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t.discount} ({appliedPromo}):</span>
                  <span>-{discountAmount.toLocaleString()} {t.egp}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.shipping} ({isAr ? selectedGov.nameAr : selectedGov.nameEn}):</span>
                <span className={shippingCost === 0 ? 'text-emerald-700 font-bold' : ''}>
                  {shippingCost === 0 ? t.freeShippingBadge : `${shippingCost} ${t.egp}`}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-[#1C140E] pt-2 border-t border-[#E8E1D5]">
                <span>{t.total}:</span>
                <span>{total.toLocaleString()} {t.egp}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#7A6B5E] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                {t.deliveryTimeEstimate}: {selectedGov.deliveryDays} ({isAr ? 'شحن فوري لباب البيت' : 'Direct door delivery'})
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="confirm-order-submit-btn"
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl bg-[#2C1D11] hover:bg-[#3D2817] text-[#FAF8F5] font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
              <span>{submitting ? (isAr ? 'جاري تسجيل الطلب...' : 'Processing...') : t.confirmOrder}</span>
            </button>

            <p className="text-center text-[10px] text-[#8A7A6E] mt-2">
              بضغطك على تأكيد الطلب، يحق لك المعاينة الكاملة والقياس قبل سداد أي مبلغ للمندوب.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
