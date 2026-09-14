import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Mail, 
  Heart,
  Award
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: Language;
  onOpenTrackOrder: () => void;
  onOpenSizeGuide: () => void;
  onSelectCollection: (c: 'sale' | 'new' | 'last_sizes') => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenTrackOrder,
  onOpenSizeGuide,
  onSelectCollection,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  return (
    <footer className="bg-[#1C140E] text-[#FAF8F5] pt-12 sm:pt-16 pb-8 border-t border-[#3D2817] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Brand Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2C1D11] to-[#121212] flex items-center justify-center text-[#C5A059] shadow-lg border border-[#C5A059]/40 text-2xl font-serif font-black">
              خ
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block">
                {t.brandName} <span className="text-sm font-normal text-[#C5A059] font-sans">KHATWA</span>
              </span>
              <p className="text-xs text-[#C5A059] font-bold tracking-wide">
                "{t.slogan}"
              </p>
            </div>
          </div>

          {/* Quick Contact Chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="https://wa.me/201023456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-700/50 transition-all font-bold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>خدمة العملاء عبر واتساب</span>
            </a>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#D8C9B9]">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-mono">01023456789</span>
            </div>
          </div>
        </div>

        {/* 4 Column Links & Policies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-[#BFAEA0]">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <h5 className="font-black text-sm text-[#FAF8F5] tracking-wide">
              عن براند خطوة 🇪🇬
            </h5>
            <p className="leading-relaxed text-[#A8988B]">
              براند أحذية مصري متخصص في صناعة وتقديم أحدث صيحات الأحذية الرجالي والحريمي. نستخدم أجود خامات الجلد الطبيعي، مع تقنيات راحة متطورة تناسب نمط الحياة اليومي في مصر.
            </p>
            <div className="flex items-center gap-2 text-white font-bold">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>صناعة مصرية بمعايير عالمية</span>
            </div>
          </div>

          {/* Col 2: Shopping & Support */}
          <div className="space-y-3">
            <h5 className="font-black text-sm text-[#FAF8F5] tracking-wide">
              خدمة العملاء والمساعدة
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5"
                >
                  <span>📦 {t.trackOrder}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5"
                >
                  <span>📐 {t.sizeGuide} وطريقة القياس</span>
                </button>
              </li>
              <li>
                <span className="text-[#8E7E72] block">
                  سياسة الاستبدال: 14 يوم استبدال مجاني للمقاس
                </span>
              </li>
              <li>
                <span className="text-[#8E7E72] block">
                  حق المعاينة: افحص الحذاء مع المندوب قبل الدفع
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Collections */}
          <div className="space-y-3">
            <h5 className="font-black text-sm text-[#FAF8F5] tracking-wide">
              التشكيلات والمجموعات
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCollection('sale')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  ⚡ تخفيضات وعروض الموسم
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCollection('new')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  ✨ وصل حديثاً (New Drops)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCollection('last_sizes')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  ⏳ آخر المقاسات بخصم إضافي
                </button>
              </li>
              <li>
                <span className="text-[#8E7E72]">
                  أحذية جلد طبيعي مصري رجالي وحريمي
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Coverage & Address */}
          <div className="space-y-3">
            <h5 className="font-black text-sm text-[#FAF8F5] tracking-wide">
              فروعنا ومناطق التوصيل
            </h5>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>المقر الرئيسي: القاهرة، جمهورية مصر العربية. نوصل لجميع المحافظات (24-48 ساعة).</span>
            </p>
            <p className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>شحن مجاني على كافة الطلبات فوق 1,000 ج.م</span>
            </p>
          </div>

        </div>

        {/* Egyptian Accepted Payment Methods Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center flex-wrap justify-center gap-2">
            <span className="text-[#8E7E72] ml-2">طرق الدفع المدعومة في مصر:</span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 font-bold text-white border border-white/10">
              💵 الدفع عند الاستلام (مع المعاينة)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-purple-900/40 text-purple-200 font-bold border border-purple-500/30">
              📱 إنستاباي InstaPay
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-900/40 text-emerald-200 font-bold border border-emerald-500/30">
              💳 بطاقة ميزة Meeza
            </span>
            <span className="px-2.5 py-1 rounded-md bg-red-900/40 text-red-200 font-bold border border-red-500/30">
              🔴 فودافون كاش
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-900/40 text-blue-200 font-bold border border-blue-500/30">
              Visa / Mastercard
            </span>
          </div>

          <p className="text-[#7A6A5E] text-center md:text-end">
            جميع الحقوق محفوظة © {new Date().getFullYear()} لمتجر خطوة شوز (KHATWA Footwear).
          </p>

        </div>

      </div>
    </footer>
  );
};
