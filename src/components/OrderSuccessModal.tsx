import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MessageCircle, 
  ArrowRight, 
  ArrowLeft, 
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { Order, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  language,
  onTrackOrder,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  if (!isOpen || !order) return null;

  const whatsappMessage = encodeURIComponent(
    `مرحباً خدمة عملاء خطوة! أنا أود الاستفسار عن طلبي رقم: ${order.id} باسم: ${order.customer.fullName}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        id="order-success-modal"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8E1D5] overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-center p-6 sm:p-8"
      >
        {/* Big Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* Title & Congratulations */}
        <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mb-1">
          {t.orderSuccessTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6B5E] max-w-md mx-auto mb-6">
          {t.thankYouMsg}
        </p>

        {/* Order Details Badge Card */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] text-start space-y-3 mb-6">
          <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-2.5">
            <div>
              <span className="text-[11px] text-[#8A7A6E] block">{t.orderNumber}</span>
              <span className="font-mono text-sm sm:text-base font-black text-[#2C1D11]">{order.id}</span>
            </div>
            <div className="text-end">
              <span className="text-[11px] text-[#8A7A6E] block">{t.orderTrackingCode}</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#8B5A2B]">{order.trackingNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[#8A7A6E] block text-[11px]">{t.fullName}:</span>
              <span className="font-bold text-[#1A1A1A]">{order.customer.fullName}</span>
            </div>
            <div>
              <span className="text-[#8A7A6E] block text-[11px]">{t.governorate}:</span>
              <span className="font-bold text-[#1A1A1A]">{order.customer.city}</span>
            </div>
            <div>
              <span className="text-[#8A7A6E] block text-[11px]">{t.total}:</span>
              <span className="font-black text-[#1C140E]">{order.total.toLocaleString()} {t.egp}</span>
            </div>
            <div>
              <span className="text-[#8A7A6E] block text-[11px]">{t.deliveryTimeEstimate}:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>{order.estimatedDelivery}</span>
              </span>
            </div>
          </div>

          {/* Ordered items summary */}
          <div className="pt-2 border-t border-[#EFE8DE]">
            <span className="text-[11px] font-bold text-[#5C4D42] block mb-1">
              الأحذية المطلوبة ({order.items.length}):
            </span>
            <div className="space-y-1">
              {order.items.map((item) => (
                <div key={item.id} className="text-[11px] text-[#4A3B32] flex justify-between">
                  <span>{item.product.name} (مقاس {item.selectedSize}) × {item.quantity}</span>
                  <span className="font-bold">{(item.product.price * item.quantity).toLocaleString()} {t.egp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courier Inspection Reminder */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>تذكير: يحق لك فتح الشحنة وتجربة الحذاء قبل الدفع للمندوب! 🇪🇬</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            id="success-track-btn"
            onClick={() => {
              onClose();
              onTrackOrder(order.id);
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#2C1D11] hover:bg-[#3D2817] text-[#FAF8F5] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Package className="w-4 h-4 text-[#C5A059]" />
            <span>{t.trackStatusBtn}</span>
          </button>

          <a
            href={`https://wa.me/201023456789?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.whatsAppCustomerService}</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-[#8A7A6E] font-bold hover:text-[#1A1A1A] transition-colors"
          >
            {t.continueShopping}
          </button>
        </div>

      </div>
    </div>
  );
};
