import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Truck, 
  Globe, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Product, Language, Gender, ShoeStyle } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTrackOrder: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  activeGender: Gender;
  onSelectGender: (gender: Gender) => void;
  activeStyle: ShoeStyle;
  onSelectStyle: (style: ShoeStyle) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
  products,
  onSelectProduct,
  activeGender,
  onSelectGender,
  activeStyle,
  onSelectStyle,
  searchQuery,
  setSearchQuery,
}) => {
  const t = TRANSLATIONS[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter products for quick search dropdown
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E1D5] shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#2C1D11] text-[#FAF8F5] py-2 px-4 text-xs md:text-sm font-medium text-center flex items-center justify-center gap-2 border-b border-[#3D2817]">
        <span className="inline-block animate-pulse text-[#C5A059]">✦</span>
        <span>{t.announcement}</span>
        <span className="hidden sm:inline-block animate-pulse text-[#C5A059]">✦</span>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 md:gap-8">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#2C1D11] hover:bg-[#EFE8DE] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { onSelectGender('all'); onSelectStyle('all'); }}>
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-[#2C1D11] to-[#121212] flex items-center justify-center text-[#FAF8F5] shadow-md border border-[#C5A059]/40">
              <span className="font-bold text-lg md:text-xl font-serif text-[#C5A059]">خ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-[#1A1A1A] leading-none">
                {t.brandName}
              </span>
              <span className="text-[10px] md:text-xs tracking-widest text-[#8A7563] font-semibold mt-0.5">
                {t.brandSub}
              </span>
            </div>
          </div>

          {/* Desktop Gender / Category Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-tab-all"
              onClick={() => { onSelectGender('all'); onSelectStyle('all'); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeGender === 'all' && activeStyle === 'all'
                  ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                  : 'text-[#4A3B32] hover:bg-[#EFE8DE] hover:text-[#1A1A1A]'
              }`}
            >
              {t.allShoes}
            </button>
            <button
              id="nav-tab-men"
              onClick={() => { onSelectGender('men'); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeGender === 'men'
                  ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                  : 'text-[#4A3B32] hover:bg-[#EFE8DE] hover:text-[#1A1A1A]'
              }`}
            >
              {t.men}
            </button>
            <button
              id="nav-tab-women"
              onClick={() => { onSelectGender('women'); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeGender === 'women'
                  ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                  : 'text-[#4A3B32] hover:bg-[#EFE8DE] hover:text-[#1A1A1A]'
              }`}
            >
              {t.women}
            </button>
            <button
              id="nav-tab-classic"
              onClick={() => onSelectStyle('classic')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeStyle === 'classic'
                  ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                  : 'text-[#4A3B32] hover:bg-[#EFE8DE] hover:text-[#1A1A1A]'
              }`}
            >
              {t.classic}
            </button>
            <button
              id="nav-tab-casual"
              onClick={() => onSelectStyle('casual')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeStyle === 'casual'
                  ? 'bg-[#2C1D11] text-[#FAF8F5] shadow-xs'
                  : 'text-[#4A3B32] hover:bg-[#EFE8DE] hover:text-[#1A1A1A]'
              }`}
            >
              {t.casual}
            </button>
            <button
              id="nav-tab-offers"
              onClick={() => onSelectStyle('all')}
              className="px-3.5 py-2 rounded-lg text-sm font-bold text-[#A74127] hover:bg-[#FBEBE7] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              {t.offers}
            </button>
          </nav>

          {/* Search bar */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xs md:max-w-sm hidden sm:block">
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-[#F3EFEA] border border-[#E0D7C9] rounded-xl py-2 pl-9 pr-10 text-xs md:text-sm text-[#1A1A1A] placeholder-[#8A7A6E] focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
              />
              <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-[#8A7A6E] ${language === 'ar' ? 'right-3' : 'left-3'}`} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-xs text-[#8A7A6E] hover:text-[#1A1A1A] ${language === 'ar' ? 'left-3' : 'right-3'}`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Results Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-[#E8E1D5] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-[#F0EBE1] text-[11px] font-semibold text-[#8A7A6E]">
                  نتائج مطابقة ({searchResults.length})
                </div>
                <div className="divide-y divide-[#F5F1E9] max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        setSearchFocused(false);
                      }}
                      className="p-2.5 flex items-center gap-3 hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-[#EBE3D7]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1A1A1A] truncate">
                          {language === 'ar' ? product.name : product.nameEn}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-[#2C1D11]">
                            {product.price} {t.egp}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-[#9A8E83] line-through">
                              {product.originalPrice} {t.egp}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFE8DE] text-[#4A3B32] font-semibold whitespace-nowrap">
                        {product.gender === 'men' ? t.men : t.women}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Icons & Triggers */}
          <div className="flex items-center gap-1.5 md:gap-3">
            
            {/* Track Order Icon Button */}
            <button
              id="header-track-order-btn"
              onClick={onOpenTrackOrder}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-[#E0D7C9] bg-[#F5F0E8] text-[#2C1D11] hover:bg-[#EAE2D5] transition-all"
              title={t.trackOrder}
            >
              <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.trackOrder}</span>
            </button>

            {/* Language Switcher */}
            <button
              id="header-language-toggle-btn"
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-xs font-bold px-2 py-1.5 rounded-xl text-[#2C1D11] hover:bg-[#EFE8DE] transition-colors"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-[#8A7A6E]" />
              <span>{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl text-[#2C1D11] hover:bg-[#EFE8DE] transition-colors"
              aria-label={t.wishlist}
              title={t.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#A74127] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#2C1D11] text-[#FAF8F5] hover:bg-[#3D2817] shadow-sm transition-all"
              aria-label={t.cart}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C5A059] text-[#121212] text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-[#D8C9B9] font-medium leading-none">
                  {t.cart}
                </span>
                <span className="text-xs font-black text-[#FAF8F5] leading-none mt-1">
                  {cartTotal} {t.egp}
                </span>
              </div>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3 pt-1 sm:hidden">
          <div className="relative">
            <input
              id="mobile-search-input"
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3EFEA] border border-[#E0D7C9] rounded-xl py-2 px-9 text-xs text-[#1A1A1A] placeholder-[#8A7A6E] focus:outline-hidden focus:border-[#C5A059]"
            />
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-[#8A7A6E] ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-xs text-[#8A7A6E] hover:text-[#1A1A1A] ${language === 'ar' ? 'left-3' : 'right-3'}`}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E8E1D5] space-y-2 animate-in fade-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2 pb-3">
              <button
                onClick={() => { onSelectGender('men'); setMobileMenuOpen(false); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center border ${
                  activeGender === 'men' ? 'bg-[#2C1D11] text-white border-[#2C1D11]' : 'bg-white border-[#E0D7C9] text-[#2C1D11]'
                }`}
              >
                👞 {t.men}
              </button>
              <button
                onClick={() => { onSelectGender('women'); setMobileMenuOpen(false); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center border ${
                  activeGender === 'women' ? 'bg-[#2C1D11] text-white border-[#2C1D11]' : 'bg-white border-[#E0D7C9] text-[#2C1D11]'
                }`}
              >
                👠 {t.women}
              </button>
            </div>

            <div className="space-y-1 pt-1 border-t border-[#F0EBE1]">
              <button
                onClick={() => { onSelectGender('all'); onSelectStyle('all'); setMobileMenuOpen(false); }}
                className="w-full text-start py-2 px-3 rounded-lg text-xs font-bold text-[#2C1D11] hover:bg-[#EFE8DE]"
              >
                {t.allShoes}
              </button>
              <button
                onClick={() => { onSelectStyle('classic'); setMobileMenuOpen(false); }}
                className="w-full text-start py-2 px-3 rounded-lg text-xs font-bold text-[#2C1D11] hover:bg-[#EFE8DE]"
              >
                {t.classic}
              </button>
              <button
                onClick={() => { onSelectStyle('casual'); setMobileMenuOpen(false); }}
                className="w-full text-start py-2 px-3 rounded-lg text-xs font-bold text-[#2C1D11] hover:bg-[#EFE8DE]"
              >
                {t.casual}
              </button>
              <button
                onClick={() => { onSelectStyle('sport'); setMobileMenuOpen(false); }}
                className="w-full text-start py-2 px-3 rounded-lg text-xs font-bold text-[#2C1D11] hover:bg-[#EFE8DE]"
              >
                {t.sport}
              </button>
              <button
                onClick={() => { onSelectStyle('loafers'); setMobileMenuOpen(false); }}
                className="w-full text-start py-2 px-3 rounded-lg text-xs font-bold text-[#2C1D11] hover:bg-[#EFE8DE]"
              >
                {t.loafers}
              </button>
              <button
                onClick={() => { onSelectStyle('boots'); setMobileMenuOpen(false); }}
                className="w-full text-start py-2 px-3 rounded-lg text-xs font-bold text-[#2C1D11] hover:bg-[#EFE8DE]"
              >
                {t.boots}
              </button>
              <button
                onClick={() => { onOpenTrackOrder(); setMobileMenuOpen(false); }}
                className="w-full text-start py-2 px-3 rounded-lg text-xs font-bold text-[#C5A059] bg-[#2C1D11] flex items-center justify-between"
              >
                <span>📦 {t.trackOrder}</span>
                <span>←</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
