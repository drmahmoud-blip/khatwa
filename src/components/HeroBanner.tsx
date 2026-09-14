import React from 'react';
import { 
  Eye, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Award
} from 'lucide-react';
import { Language, Gender } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroBannerProps {
  language: Language;
  onSelectGender: (gender: Gender) => void;
  onSelectCollection: (coll: 'sale' | 'new') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onSelectGender,
  onSelectCollection,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="relative overflow-hidden bg-[#FAF8F5] pt-4 pb-8 md:pt-6 md:pb-12">
      {/* Decorative subtle background shapes */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-[#2C1D11]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C140E] via-[#2A1C12] to-[#120F0C] text-white shadow-2xl border border-[#3E2C1E]">
          
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px] md:min-h-[500px]">
            
            {/* Left Content (Text & CTAs) */}
            <div className="lg:col-span-7 p-6 sm:p-10 md:p-14 z-10 flex flex-col justify-center">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E7C785] text-xs md:text-sm font-semibold mb-5 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>مجموعة الموسم الجديد 2026 • New Arrivals</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-[#FAF8F5] mb-4">
                {isAr ? (
                  <>
                    كل خطوة <span className="text-[#C5A059] font-serif underline decoration-[#C5A059]/40 decoration-wavy decoration-2">ليها ستايل.</span>
                  </>
                ) : (
                  <>
                    Every Step <span className="text-[#C5A059] font-serif">Has Style.</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-[#D6C7B8] max-w-xl leading-relaxed mb-8">
                {isAr
                  ? 'أحذية مصممة خصيصاً للذوق المصري العصري. جلد طبيعي فاخر، نعل مريح للمشاوير والعمل، وضمان المعاينة والتجربة قبل الدفع مع المندوب لباب بيتك.'
                  : 'Footwear engineered for the modern Egyptian lifestyle. 100% handcrafted leather, supreme all-day walking comfort, and open-box inspection before payment.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  id="hero-shop-men-btn"
                  onClick={() => onSelectGender('men')}
                  className="px-5 sm:px-7 py-3 rounded-xl bg-[#C5A059] text-[#140E0A] font-extrabold text-sm sm:text-base hover:bg-[#D4AF37] active:scale-98 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'تسوق أحذية الرجال' : 'Shop Men'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>

                <button
                  id="hero-shop-women-btn"
                  onClick={() => onSelectGender('women')}
                  className="px-5 sm:px-7 py-3 rounded-xl bg-[#FAF8F5] text-[#1C140E] font-extrabold text-sm sm:text-base hover:bg-white active:scale-98 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'تسوق أحذية النساء' : 'Shop Women'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>

                <button
                  id="hero-sale-btn"
                  onClick={() => onSelectCollection('sale')}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#E7C785] border border-[#C5A059]/30 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  {isAr ? '⚡ عروض الخصومات' : 'Special Deals'}
                </button>
              </div>

              {/* Fast credibility check */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4 sm:gap-6 text-xs text-[#B8A695]">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <span>جلد طبيعي مصري 100%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>معاينة وقياس قبل الاستلام</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>توصيل لكافة المحافظات</span>
                </div>
              </div>

            </div>

            {/* Right Visual Image Showcase */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[380px] p-6 flex items-center justify-center">
              {/* Product floating image with shadow */}
              <div className="relative w-full max-w-md aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A059]/30 group">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"
                  alt="Modern Egyptian Footwear Showcase"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Overlay Floating Tag */}
                <div className="absolute bottom-4 right-4 left-4 p-3.5 bg-[#FAF8F5]/95 backdrop-blur-md rounded-xl text-[#1A1A1A] border border-[#E0D7C9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#A74127] uppercase tracking-wider block">
                      {isAr ? 'الأكثر طلباً هذا الأسبوع' : 'Trending Drop'}
                    </span>
                    <p className="text-xs sm:text-sm font-black text-[#2C1D11]">
                      {isAr ? 'سنيكرز إير فليكس العصري' : 'AirFlex Urban Sneaker'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-[#1C140E]">980 ج.م</span>
                    <span className="block text-[10px] text-emerald-700 font-bold">معاينة مجانية</span>
                  </div>
                </div>

                {/* Top Corner Badge */}
                <div className="absolute top-4 left-4 bg-[#C5A059] text-[#140E0A] px-3 py-1 rounded-full text-xs font-black shadow-md">
                  خصم 27%
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4 Trust & Guarantee Badges Under Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          
          <div className="p-4 rounded-2xl bg-white border border-[#E8E1D5] shadow-xs flex items-start gap-3 hover:border-[#C5A059]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#2C1D11] flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{t.trustTitle1}</h2>
              <p className="text-[11px] text-[#7A6B5E] mt-0.5 leading-snug line-clamp-2">{t.trustDesc1}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E1D5] shadow-xs flex items-start gap-3 hover:border-[#C5A059]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#2C1D11] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{t.trustTitle2}</h2>
              <p className="text-[11px] text-[#7A6B5E] mt-0.5 leading-snug line-clamp-2">{t.trustDesc2}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E1D5] shadow-xs flex items-start gap-3 hover:border-[#C5A059]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#2C1D11] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{t.trustTitle3}</h2>
              <p className="text-[11px] text-[#7A6B5E] mt-0.5 leading-snug line-clamp-2">{t.trustDesc3}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E1D5] shadow-xs flex items-start gap-3 hover:border-[#C5A059]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#2C1D11] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">{t.trustTitle4}</h2>
              <p className="text-[11px] text-[#7A6B5E] mt-0.5 leading-snug line-clamp-2">{t.trustDesc4}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
