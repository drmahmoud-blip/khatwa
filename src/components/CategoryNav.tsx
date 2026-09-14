import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Layers, 
  Hourglass, 
  Footprints, 
  Briefcase, 
  Dumbbell, 
  Compass, 
  Sun 
} from 'lucide-react';
import { Gender, ShoeStyle, CollectionType, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CategoryNavProps {
  language: Language;
  activeGender: Gender;
  onSelectGender: (g: Gender) => void;
  activeStyle: ShoeStyle;
  onSelectStyle: (s: ShoeStyle) => void;
  activeCollection: CollectionType;
  onSelectCollection: (c: CollectionType) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  language,
  activeGender,
  onSelectGender,
  activeStyle,
  onSelectStyle,
  activeCollection,
  onSelectCollection,
}) => {
  const t = TRANSLATIONS[language];

  const styleTabs: { id: ShoeStyle; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t.allShoes, icon: <Layers className="w-4 h-4" /> },
    { id: 'casual', label: t.casual, icon: <Footprints className="w-4 h-4" /> },
    { id: 'classic', label: t.classic, icon: <Briefcase className="w-4 h-4" /> },
    { id: 'sport', label: t.sport, icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'loafers', label: t.loafers, icon: <Compass className="w-4 h-4" /> },
    { id: 'boots', label: t.boots, icon: <Layers className="w-4 h-4" /> },
    { id: 'sandals', label: t.sandals, icon: <Sun className="w-4 h-4" /> },
  ];

  const collections: { id: CollectionType; label: string; badge?: string; icon: React.ReactNode }[] = [
    { id: 'all', label: language === 'ar' ? 'كل المجموعات' : 'All Drops', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'new', label: t.newArrivals, icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'best_sellers', label: t.bestSellers, icon: <Flame className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'sale', label: t.offers, badge: 'تخفيضات', icon: <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> },
    { id: 'last_sizes', label: t.lastSizes, badge: 'قطع أخيرة', icon: <Hourglass className="w-3.5 h-3.5 text-orange-600" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      
      {/* Gender Quick Switch Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E8E1D5]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#8A7A6E] hidden sm:inline-block">
            {language === 'ar' ? 'التصنيف الرئيسي:' : 'Department:'}
          </span>
          <div className="inline-flex p-1 bg-[#EFE8DE] rounded-xl">
            <button
              id="gender-filter-all"
              onClick={() => onSelectGender('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGender === 'all'
                  ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                  : 'text-[#5C4D42] hover:text-[#1A1A1A]'
              }`}
            >
              {language === 'ar' ? 'الكل (رجالي وحريمي)' : 'All'}
            </button>
            <button
              id="gender-filter-men"
              onClick={() => onSelectGender('men')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGender === 'men'
                  ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                  : 'text-[#5C4D42] hover:text-[#1A1A1A]'
              }`}
            >
              👞 {t.men}
            </button>
            <button
              id="gender-filter-women"
              onClick={() => onSelectGender('women')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGender === 'women'
                  ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                  : 'text-[#5C4D42] hover:text-[#1A1A1A]'
              }`}
            >
              👠 {t.women}
            </button>
          </div>
        </div>

        {/* Curated Collection Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          {collections.map((coll) => (
            <button
              key={coll.id}
              onClick={() => onSelectCollection(coll.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                activeCollection === coll.id
                  ? 'bg-[#FAF5ED] border-[#C5A059] text-[#2C1D11] shadow-xs ring-1 ring-[#C5A059]/30'
                  : 'bg-white border-[#E0D7C9] text-[#5C4D42] hover:border-[#C5A059]/40 hover:bg-[#FAF8F5]'
              }`}
            >
              {coll.icon}
              <span>{coll.label}</span>
              {coll.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#A74127] text-white font-black">
                  {coll.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Style / Category Horizontal Scrollable Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {styleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectStyle(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeStyle === tab.id
                ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-sm'
                : 'bg-white text-[#4A3B32] border border-[#E8E1D5] hover:bg-[#FAF8F5]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};
