import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialGender?: 'men' | 'women';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  initialGender = 'men',
}) => {
  const t = TRANSLATIONS[language];
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>(initialGender);
  const isAr = language === 'ar';

  if (!isOpen) return null;

  const menSizes = [
    { eu: 40, cm: '25.0', us: '7.5', uk: '6.5' },
    { eu: 41, cm: '25.8', us: '8.5', uk: '7.5' },
    { eu: 42, cm: '26.5', us: '9.0', uk: '8.0' },
    { eu: 43, cm: '27.3', us: '10.0', uk: '9.0' },
    { eu: 44, cm: '28.0', us: '11.0', uk: '10.0' },
    { eu: 45, cm: '28.8', us: '12.0', uk: '11.0' },
    { eu: 46, cm: '29.5', us: '13.0', uk: '12.0' },
  ];

  const womenSizes = [
    { eu: 36, cm: '22.5', us: '5.5', uk: '3.5' },
    { eu: 37, cm: '23.2', us: '6.5', uk: '4.5' },
    { eu: 38, cm: '24.0', us: '7.5', uk: '5.5' },
    { eu: 39, cm: '24.7', us: '8.5', uk: '6.5' },
    { eu: 40, cm: '25.5', us: '9.5', uk: '7.5' },
    { eu: 41, cm: '26.2', us: '10.5', uk: '8.5' },
  ];

  const activeTable = selectedGender === 'men' ? menSizes : womenSizes;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="size-guide-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8E1D5] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FAF8F5] border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C1D11] text-[#FAF8F5] flex items-center justify-center">
              <Ruler className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                {t.sizeGuide}
              </h3>
              <p className="text-xs text-[#8A7A6E]">
                {isAr ? 'اختر مقاسك الدقيق حسب الطول بالسنتيمتر' : 'Find your exact fit in cm & EU sizing'}
              </p>
            </div>
          </div>
          <button
            id="close-size-guide-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6B5E] hover:bg-[#EFE8DE] hover:text-[#1A1A1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Gender Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-[#F0EBE1] rounded-xl">
              <button
                onClick={() => setSelectedGender('men')}
                className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  selectedGender === 'men'
                    ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6A5A4E] hover:text-[#1A1A1A]'
                }`}
              >
                👞 {isAr ? 'مقاسات الرجال' : 'Men Sizing'}
              </button>
              <button
                onClick={() => setSelectedGender('women')}
                className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  selectedGender === 'women'
                    ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6A5A4E] hover:text-[#1A1A1A]'
                }`}
              >
                👠 {isAr ? 'مقاسات النساء' : 'Women Sizing'}
              </button>
            </div>
          </div>

          {/* Size Conversion Table */}
          <div className="border border-[#E8E1D5] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#2C1D11] text-[#FAF8F5] text-xs">
                  <th className="py-3 px-3 font-bold border-b border-[#3D2817]">
                    {isAr ? 'المقاس المصري (EU)' : 'EU (Egypt)'}
                  </th>
                  <th className="py-3 px-3 font-bold border-b border-[#3D2817] text-[#C5A059]">
                    {isAr ? 'طول القدم (سم)' : 'Foot Length (cm)'}
                  </th>
                  <th className="py-3 px-3 font-bold border-b border-[#3D2817] hidden sm:table-cell">
                    US
                  </th>
                  <th className="py-3 px-3 font-bold border-b border-[#3D2817] hidden sm:table-cell">
                    UK
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DE] text-xs sm:text-sm text-[#2C1D11]">
                {activeTable.map((row) => (
                  <tr key={row.eu} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-2.5 px-3 font-black text-sm text-[#1A1A1A]">
                      {row.eu}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#8B5A2B]">
                      {row.cm} سم
                    </td>
                    <td className="py-2.5 px-3 text-[#6A5A4E] hidden sm:table-cell">
                      {row.us}
                    </td>
                    <td className="py-2.5 px-3 text-[#6A5A4E] hidden sm:table-cell">
                      {row.uk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Step-by-Step Measuring Guide */}
          <div className="p-4 rounded-2xl bg-[#F8F5EF] border border-[#E8E1D5] space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#2C1D11] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
              <span>{t.howToMeasure}:</span>
            </h4>
            <ol className="text-xs text-[#5C4D42] space-y-2 list-decimal list-inside leading-relaxed">
              <li>{isAr ? 'ضع ورقة بيضاء على أرضية مستوية بجانب حائط قائم.' : 'Place a blank sheet of paper flat on the floor against a straight wall.'}</li>
              <li>{isAr ? 'قف على الورقة مع ملامسة كعب قدمك للحائط بشكل طبيعي.' : 'Stand on the paper with your heel lightly touching the wall.'}</li>
              <li>{isAr ? 'ضع علامة بالقلم عند أطول إصبع في قدمك (غالباً الإصبع الأكبر).' : 'Mark the longest point of your toes with a pencil.'}</li>
              <li>{isAr ? 'قِس المسافة من الحافة إلى العلامة بالمسطرة، وطابقها مع الجدول أعلاه.' : 'Measure the distance with a ruler in centimeters and match the table above.'}</li>
            </ol>
          </div>

          {/* Egyptian Fit & Courier Inspection Guarantee */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">
                {isAr ? 'ميزة المعاينة والقياس مع مندوب خطوة 🇪🇬' : 'Try on with the Courier in Egypt'}
              </p>
              <p className="text-amber-800 leading-relaxed text-[11px] sm:text-xs">
                {isAr
                  ? 'لا تقلق بشأن المقاس! عند وصول المندوب، يحق لك فتح العلبة وتجربة الحذاء في قدمك للتأكد من المقاس والراحة التامة قبل دفع أي مليم. كما يمكنك طلب استبدال المقاس مجاناً خلال 14 يوم.'
                  : 'Don’t worry about sizing! When your delivery arrives, you are fully entitled to open the box and try on the shoes before paying the courier.'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E1D5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#2C1D11] text-[#FAF8F5] font-bold text-xs hover:bg-[#3D2817] transition-colors"
          >
            {isAr ? 'فهمت، شكراً' : 'Got it, thanks'}
          </button>
        </div>

      </div>
    </div>
  );
};
