import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone,
  AlertCircle 
} from 'lucide-react';
import { Order, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  orders: Order[];
  prefilledOrderId?: string | null;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  language,
  orders,
  prefilledOrderId,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  const [query, setQuery] = useState(prefilledOrderId || (orders.length > 0 ? orders[0].id : ''));
  const [activeOrder, setActiveOrder] = useState<Order | null>(
    orders.find((o) => o.id === query || o.customer.phoneNumber === query) || (orders.length > 0 ? orders[0] : null)
  );
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanQuery = query.trim().toUpperCase();
    const found = orders.find(
      (o) => o.id.toUpperCase() === cleanQuery || o.customer.phoneNumber.includes(query.trim())
    );
    setActiveOrder(found || null);
  };

  const steps = [
    { key: 'confirmed', label: t.statusConfirmed, desc: isAr ? 'تم استلام وتأكيد طلبك وتخصيص المقاس' : 'Order received & size allocated' },
    { key: 'preparing', label: t.statusPreparing, desc: isAr ? 'فحص جودة الحذاء والتغليف بالعلبة الفاخرة' : 'Quality check & luxury boxing' },
    { key: 'with_courier', label: t.statusWithCourier, desc: isAr ? 'مع المندوب للتوصيل والمعاينة أمامك' : 'Out for delivery with open-box trial' },
    { key: 'delivered', label: t.statusDelivered, desc: isAr ? 'تم الاستلام والدفع بنجاح' : 'Delivered & inspected successfully' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: Order['status']) => {
    const orderIndex = steps.findIndex((s) => s.key === currentStatus);
    const thisIndex = steps.findIndex((s) => s.key === stepKey);
    if (thisIndex < orderIndex) return 'completed';
    if (thisIndex === orderIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        id="order-tracking-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8E1D5] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C1D11] text-[#FAF8F5] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#1A1A1A]">
                {t.trackOrder}
              </h3>
              <p className="text-xs text-[#8A7A6E]">
                {isAr ? 'تابع شحنتك خطوة بخطوة حتى باب منزلك' : 'Track your delivery step-by-step'}
              </p>
            </div>
          </div>
          <button
            id="close-order-tracking-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6B5E] hover:bg-[#EFE8DE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-[#1A1A1A]">
              {t.trackSearchPrompt}:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="tracking-query-input"
                  type="text"
                  placeholder={isAr ? 'مثال: KTW-12345 أو 010XXXXXXXX' : 'e.g. KTW-12345 or 010...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl py-2.5 px-3 pl-9 text-xs sm:text-sm font-mono text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
                />
                <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 text-[#8A7A6E]" />
              </div>
              <button
                id="tracking-search-submit-btn"
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2C1D11] text-[#FAF8F5] text-xs font-bold hover:bg-[#3D2817] transition-all shrink-0 cursor-pointer"
              >
                {t.searchOrderBtn}
              </button>
            </div>
          </form>

          {/* Quick chip selector for recent orders if any */}
          {orders.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#8A7A6E] block">
                {t.recentOrders}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {orders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setQuery(o.id);
                      setActiveOrder(o);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      activeOrder?.id === o.id
                        ? 'bg-[#2C1D11] text-[#FAF8F5] border-[#2C1D11]'
                        : 'bg-[#FAF8F5] border-[#E0D7C9] text-[#4A3B32] hover:bg-[#EFE8DE]'
                    }`}
                  >
                    {o.id} ({o.customer.fullName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Order Tracking Result */}
          {activeOrder ? (
            <div className="space-y-5">
              
              {/* Order Overview Header Card */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#EFE8DE] pb-2.5">
                  <div>
                    <span className="text-[10px] text-[#8A7A6E] block">{t.orderNumber}</span>
                    <span className="font-mono text-sm sm:text-base font-black text-[#1C140E]">{activeOrder.id}</span>
                  </div>
                  <div className="text-end">
                    <span className="text-[10px] text-[#8A7A6E] block">{t.deliveryTimeEstimate}</span>
                    <span className="font-bold text-xs sm:text-sm text-emerald-700">{activeOrder.estimatedDelivery}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-[#8A7A6E] block">{t.fullName}</span>
                    <span className="font-bold text-[#1A1A1A]">{activeOrder.customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A7A6E] block">{t.governorate}</span>
                    <span className="font-bold text-[#1A1A1A]">{activeOrder.customer.city}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A7A6E] block">{t.total}</span>
                    <span className="font-black text-[#1C140E]">{activeOrder.total.toLocaleString()} {t.egp}</span>
                  </div>
                </div>
              </div>

              {/* Progress Timeline Pipeline */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E1D5] space-y-4">
                <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                  {isAr ? 'مراحل تجهيز وتوصيل الشحنة:' : 'Shipment Milestones:'}
                </h4>

                <div className="space-y-4 relative">
                  {steps.map((step, idx) => {
                    const status = getStepStatus(step.key, activeOrder.status);
                    return (
                      <div key={step.key} className="flex items-start gap-3 relative">
                        {/* Status Icon */}
                        <div className="relative z-10">
                          {status === 'completed' && (
                            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                          {status === 'current' && (
                            <div className="w-8 h-8 rounded-full bg-[#C5A059] text-[#121212] flex items-center justify-center animate-pulse ring-4 ring-[#C5A059]/30">
                              <Clock className="w-4 h-4" />
                            </div>
                          )}
                          {status === 'pending' && (
                            <div className="w-8 h-8 rounded-full bg-[#EFE8DE] text-[#A39487] flex items-center justify-center">
                              <span className="text-xs font-bold">{idx + 1}</span>
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className={`text-xs sm:text-sm font-bold ${
                            status === 'current' ? 'text-[#1A1A1A]' : status === 'completed' ? 'text-emerald-800' : 'text-[#8A7A6E]'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-[#7A6B5E] leading-snug mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Item summary in order */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-2">
                <span className="text-xs font-bold text-[#1A1A1A] block">الأحذية المشمولة:</span>
                <div className="divide-y divide-[#EFE8DE]">
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className="py-1.5 flex items-center justify-between text-xs">
                      <span>{item.product.name} (مقاس {item.selectedSize})</span>
                      <span className="font-bold">{(item.product.price * item.quantity).toLocaleString()} {t.egp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : searched ? (
            <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5] space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-bold text-sm text-[#1A1A1A]">لم نتمكن من العثور على هذا الطلب</p>
              <p className="text-xs text-[#8A7A6E]">تأكد من كتابة كود الطلب مثل: KTW-12345 أو رقم الهاتف المسجل به الطلب.</p>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#E8E1D5] space-y-2">
              <Package className="w-8 h-8 text-[#C5A059] mx-auto" />
              <p className="font-bold text-sm text-[#1A1A1A]">أدخل رقم الطلب أو رقم الهاتف في الأعلى</p>
              <p className="text-xs text-[#8A7A6E]">سيعرض لك خط سير الشحنة وموعد وصول المندوب بالتفصيل.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
