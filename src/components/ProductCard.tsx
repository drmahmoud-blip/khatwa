import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Sparkles, Check } from 'lucide-react';
import { Product, Language, ProductColor } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ProductCardProps {
  product: Product;
  language: Language;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product, size: number, color: ProductColor) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
}) => {
  const t = TRANSLATIONS[language];
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [showQuickSize, setShowQuickSize] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isAr = language === 'ar';
  const name = isAr ? product.name : product.nameEn;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSize === null) {
      setShowQuickSize(true);
      return;
    }

    onQuickAddToCart(product, selectedSize, product.colors[0]);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setShowQuickSize(false);
    }, 1200);
  };

  const handlePickSizeAndAdd = (e: React.MouseEvent, size: number) => {
    e.stopPropagation();
    setSelectedSize(size);
    onQuickAddToCart(product, size, product.colors[0]);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setShowQuickSize(false);
    }, 1200);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSize(false);
      }}
      className="group relative bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#C5A059]/50 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Hover Lifestyle Switch */}
      <div className="relative w-full aspect-square bg-[#F5F2EC] overflow-hidden">
        {/* Main Studio Image */}
        <img
          src={product.image}
          alt={name}
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            isHovered && product.lifestyleImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Hover Alternate / Lifestyle Image */}
        {product.lifestyleImage && (
          <img
            src={product.lifestyleImage}
            alt={`${name} lifestyle`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
            }`}
            loading="lazy"
          />
        )}

        {/* Lifestyle indicator tag */}
        {isHovered && product.lifestyleImage && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 z-10">
            <Eye className="w-3 h-3 text-[#C5A059]" />
            <span>{t.lifestyleBadge}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercent && (
            <span className="bg-[#A74127] text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#2C1D11] text-[#E7C785] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#C5A059]/40 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
              <span>{t.bestSellers}</span>
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#C5A059] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {t.newArrivals}
            </span>
          )}
          {product.isLastSize && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {t.lastSizes}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-xs transition-all z-10 ${
            isWishlisted
              ? 'bg-[#A74127] text-white'
              : 'bg-white/80 hover:bg-white text-[#2C1D11]'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Size Selection Overlay when requested */}
        {showQuickSize && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs p-4 flex flex-col justify-center items-center text-white z-20 animate-in fade-in duration-200"
          >
            <p className="text-xs font-bold mb-3 text-[#FAF8F5] text-center">
              {t.selectSizePrompt}:
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-[220px]">
              {product.sizes.map((size) => {
                const isLow = product.lowStockSizes?.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => handlePickSizeAndAdd(e, size)}
                    className="w-9 h-9 rounded-lg text-xs font-black border border-white/30 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#121212] transition-all relative"
                  >
                    {size}
                    {isLow && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowQuickSize(false)}
              className="mt-3 text-[11px] text-[#D8C9B9] underline hover:text-white"
            >
              {t.close}
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Department & Material line */}
          <div className="flex items-center justify-between text-[11px] text-[#8A7A6E] mb-1.5">
            <span className="font-semibold">
              {product.gender === 'men' ? t.men : t.women} • {product.madeIn}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-[#A39487]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#2C1D11] line-clamp-2 leading-snug mb-2 min-h-[36px]">
            {name}
          </h3>

          {/* Color Dots */}
          <div className="flex items-center gap-1.5 mb-3">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={isAr ? c.name : c.nameEn}
              />
            ))}
            <span className="text-[10px] text-[#8A7A6E] font-medium mr-1">
              ({product.colors.length} {isAr ? 'ألوان' : 'colors'})
            </span>
          </div>
        </div>

        {/* Footer: Price & Quick Action */}
        <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#1C140E]">
                {product.price.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-[#8A7A6E]">
                {t.egp}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] text-[#9A8E83] line-through block -mt-1">
                {product.originalPrice.toLocaleString()} {t.egp}
              </span>
            )}
          </div>

          {/* Quick Cart Button */}
          <button
            id={`quick-add-${product.id}`}
            type="button"
            onClick={handleQuickAdd}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              addedAnimation
                ? 'bg-emerald-700 text-white'
                : 'bg-[#F3EFEA] hover:bg-[#2C1D11] text-[#2C1D11] hover:text-[#FAF8F5]'
            }`}
            title={t.addToCart}
          >
            {addedAnimation ? (
              <Check className="w-4 h-4 animate-scale" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
