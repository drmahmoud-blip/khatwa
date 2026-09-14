import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Language, ProductColor } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  wishlistProducts: Product[];
  onRemoveWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: ProductColor) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  language,
  wishlistProducts,
  onRemoveWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        id="wishlist-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2C1D11] text-[#FAF8F5] flex items-center justify-center">
              <Heart className="w-4 h-4 text-[#A74127] fill-current" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#1A1A1A]">
                {t.wishlist} ({wishlistProducts.length})
              </h3>
              <p className="text-[11px] text-[#8A7A6E]">
                {isAr ? 'الأحذية المحفوظة للشراء لاحقاً' : 'Saved footwear for later'}
              </p>
            </div>
          </div>
          <button
            id="close-wishlist-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6B5E] hover:bg-[#EFE8DE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#F0EBE1]">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#8A7A6E]">
                <Heart className="w-8 h-8 text-[#A74127]" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#1A1A1A]">قائمة المفضلة فارغة</h4>
                <p className="text-xs text-[#8A7A6E] mt-1 max-w-xs">
                  اضغط على رمز القلب على أي حذاء يعجبك لحفظه والرجوع إليه في أي وقت.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#2C1D11] text-[#FAF8F5] text-xs font-bold hover:bg-[#3D2817] transition-all"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div key={product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#E8E1D5] cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="font-bold text-xs sm:text-sm text-[#1A1A1A] truncate cursor-pointer hover:text-[#2C1D11]"
                  >
                    {isAr ? product.name : product.nameEn}
                  </h4>

                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-black text-xs sm:text-sm text-[#1C140E]">
                      {product.price.toLocaleString()} {t.egp}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-[#9A8E83] line-through">
                        {product.originalPrice.toLocaleString()} {t.egp}
                      </span>
                    )}
                  </div>

                  {/* Add to cart action */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        onAddToCart(product, product.sizes[0], product.colors[0]);
                        onRemoveWishlist(product);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#2C1D11] text-[#FAF8F5] text-xs font-bold flex items-center gap-1 hover:bg-[#3D2817]"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C5A059]" />
                      <span>{t.addToCart}</span>
                    </button>

                    <button
                      onClick={() => onRemoveWishlist(product)}
                      className="p-1.5 text-[#9A8E83] hover:text-[#A74127] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E1D5]">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#2C1D11] text-[#FAF8F5] font-black text-xs hover:bg-[#3D2817] transition-all"
            >
              {t.continueShopping}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
