import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { FilterState, Language, Gender, ShoeStyle, CollectionType } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FilterSidebarProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalMatches: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  language,
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  totalMatches,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  const availableSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

  const availableColors = [
    { label: 'أسود', labelEn: 'Black', hex: '#1C1C1C' },
    { label: 'بني داكن', labelEn: 'Dark Brown', hex: '#3D2817' },
    { label: 'هافان / جملي', labelEn: 'Cognac / Tan', hex: '#8B5A2B' },
    { label: 'أبيض / ناصع', labelEn: 'White', hex: '#FFFFFF' },
    { label: 'بيج / أوف وايت', labelEn: 'Off-White / Beige', hex: '#EAE4D9' },
    { label: 'كحلي', labelEn: 'Navy', hex: '#1B2C46' },
  ];

  const toggleSize = (size: number) => {
    const exists = filters.selectedSizes.includes(size);
    const newSizes = exists
      ? filters.selectedSizes.filter((s) => s !== size)
      : [...filters.selectedSizes, size];
    onUpdateFilters({ selectedSizes: newSizes });
  };

  const toggleColor = (colorHex: string) => {
    const exists = filters.selectedColors.includes(colorHex);
    const newColors = exists
      ? filters.selectedColors.filter((c) => c !== colorHex)
      : [...filters.selectedColors, colorHex];
    onUpdateFilters({ selectedColors: newColors });
  };

  const Content = (
    <div className="space-y-6">
      
      {/* Header with Results Count & Clear */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
          <span className="font-black text-sm text-[#1A1A1A]">
            {t.filterBy} ({totalMatches})
          </span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-[#8B5A2B] hover:text-[#2C1D11] flex items-center gap-1 font-bold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.clearFilters}</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#1A1A1A]">
          {t.sortBy}
        </label>
        <select
          id="sort-by-select"
          value={filters.sortBy}
          onChange={(e) => onUpdateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
          className="w-full bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl p-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-hidden focus:border-[#C5A059]"
        >
          <option value="popularity">{t.popular}</option>
          <option value="price_low">{t.priceLow}</option>
          <option value="price_high">{t.priceHigh}</option>
          <option value="rating">{t.topRated}</option>
          <option value="newest">{t.newest}</option>
        </select>
      </div>

      {/* Department (Gender) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#1A1A1A]">
          {isAr ? 'القسم' : 'Department'}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['all', 'men', 'women'] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => onUpdateFilters({ gender: g })}
              className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                filters.gender === g
                  ? 'bg-[#2C1D11] text-[#FAF8F5] border-[#2C1D11]'
                  : 'bg-[#FAF8F5] text-[#4A3B32] border-[#E0D7C9] hover:bg-[#EFE8DE]'
              }`}
            >
              {g === 'all' ? (isAr ? 'الكل' : 'All') : g === 'men' ? t.men : t.women}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#1A1A1A]">{t.priceRange}</span>
          <span className="font-black text-[#8B5A2B]">
            {filters.priceRange[0]} - {filters.priceRange[1]} {t.egp}
          </span>
        </div>
        <input
          type="range"
          min="400"
          max="8000"
          step="100"
          value={filters.priceRange[1]}
          onChange={(e) => onUpdateFilters({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
          className="w-full accent-[#C5A059] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#8A7A6E]">
          <span>400 {t.egp}</span>
          <span>8,000 {t.egp}</span>
        </div>
      </div>

      {/* Available Sizes Picker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#1A1A1A]">{t.sizesFilter}</span>
          {filters.selectedSizes.length > 0 && (
            <span className="text-[10px] text-[#8B5A2B] font-bold">
              ({filters.selectedSizes.length} مختار)
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {availableSizes.map((size) => {
            const isSelected = filters.selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`h-9 rounded-xl text-xs font-black border transition-all ${
                  isSelected
                    ? 'bg-[#2C1D11] text-[#FAF8F5] border-[#2C1D11] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#2C1D11] border-[#E0D7C9] hover:border-[#C5A059]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#1A1A1A]">
          {t.colorsFilter}
        </label>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => {
            const isSelected = filters.selectedColors.includes(color.hex);
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => toggleColor(color.hex)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#FAF5ED] border-[#2C1D11] ring-1 ring-[#2C1D11]'
                    : 'bg-[#FAF8F5] border-[#E0D7C9] hover:border-[#8A7A6E]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{isAr ? color.label : color.labelEn}</span>
                {isSelected && <Check className="w-3 h-3 text-[#2C1D11]" />}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-xs sticky top-28">
          {Content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E8E1D5] flex items-center justify-between">
              <span className="font-bold text-sm text-[#1A1A1A]">{t.filterBy}</span>
              <button onClick={onClose} className="p-2 text-[#7A6B5E]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {Content}
            </div>
            <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E1D5]">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#2C1D11] text-[#FAF8F5] font-bold text-xs"
              >
                عرض النتائج ({totalMatches})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
