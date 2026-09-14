import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Check, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Sparkles, 
  AlertCircle,
  Eye,
  Camera,
  ThumbsUp,
  UserCheck
} from 'lucide-react';
import { Product, Language, ProductColor, ProductReview } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: ProductColor, qty: number) => void;
  onBuyNow: (product: Product, size: number, color: ProductColor, qty: number) => void;
  onOpenSizeGuide: () => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  language,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenSizeGuide,
  onAddReview,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState<'studio' | 'hover' | 'lifestyle'>('studio');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number | null>(product.sizes[1] || product.sizes[0] || null);
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewGov, setReviewGov] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const currentImageSrc = 
    activeImage === 'lifestyle' && product.lifestyleImage
      ? product.lifestyleImage
      : activeImage === 'hover' && product.hoverImage
      ? product.hoverImage
      : product.image;

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  const handleBuyNowClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    onAddReview(product.id, {
      authorName: reviewName,
      governorate: reviewGov || (isAr ? 'القاهرة' : 'Cairo'),
      rating: reviewRating,
      comment: reviewComment,
    });

    setReviewSubmitted(true);
    setReviewName('');
    setReviewComment('');
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
    }, 1500);
  };

  const isLowStock = selectedSize && product.lowStockSizes?.includes(selectedSize);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E8E1D5] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4"
      >
        {/* Modal Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-[#FAF8F5]/90 hover:bg-white text-[#2C1D11] border border-[#E0D7C9] flex items-center justify-center shadow-md transition-all"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[88vh] overflow-y-auto">
          
          {/* Left / Gallery Column */}
          <div className="md:col-span-6 bg-[#F8F5EF] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E1D5]">
            <div className="space-y-4">
              
              {/* Main Display Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#E0D7C9] shadow-inner">
                <img
                  src={currentImageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {/* Image View Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                  {product.discountPercent && (
                    <span className="bg-[#A74127] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                      خصم {product.discountPercent}%
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-[#2C1D11] text-[#E7C785] text-xs font-bold px-2.5 py-1 rounded-full shadow-md border border-[#C5A059]/30">
                      {t.bestSellers}
                    </span>
                  )}
                </div>

                {/* View Mode Pill */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  {activeImage === 'lifestyle' ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{t.lifestyleBadge}</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{t.studioBadge}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveImage('studio')}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === 'studio'
                      ? 'border-[#2C1D11] ring-2 ring-[#C5A059]/40'
                      : 'border-[#E0D7C9] hover:border-[#8A7A6E]'
                  }`}
                >
                  <img src={product.image} alt="Studio view" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                    زاوية رئيسية
                  </span>
                </button>

                {product.hoverImage && (
                  <button
                    type="button"
                    onClick={() => setActiveImage('hover')}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === 'hover'
                        ? 'border-[#2C1D11] ring-2 ring-[#C5A059]/40'
                        : 'border-[#E0D7C9] hover:border-[#8A7A6E]'
                    }`}
                  >
                    <img src={product.hoverImage} alt="Side view" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                      تفاصيل النعل
                    </span>
                  </button>
                )}

                {product.lifestyleImage && (
                  <button
                    type="button"
                    onClick={() => setActiveImage('lifestyle')}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === 'lifestyle'
                        ? 'border-[#2C1D11] ring-2 ring-[#C5A059]/40'
                        : 'border-[#E0D7C9] hover:border-[#8A7A6E]'
                    }`}
                  >
                    <img src={product.lifestyleImage} alt="Lifestyle view" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                      في اللبس
                    </span>
                  </button>
                )}
              </div>

            </div>

            {/* Quality & Inspection Guarantee Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>معاينة وقياس قبل الاستلام في أي مكان بمصر 🇪🇬</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                افتح العلبة مع مندوب الشحن وقيس الحذاء بنفسك للتأكد من الراحة والمقاس قبل دفع أي مبلغ.
              </p>
            </div>
          </div>

          {/* Right / Product Details & Actions Column */}
          <div className="md:col-span-6 p-5 sm:p-8 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#F0EBE1] text-[#2C1D11] text-xs font-bold">
                  {product.gender === 'men' ? t.men : t.women} • {product.madeIn}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {product.rating}
                  </span>
                  <span className="text-xs text-[#8A7A6E]">
                    ({product.reviewCount} {t.reviews})
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] leading-tight">
                {isAr ? product.name : product.nameEn}
              </h1>

              {/* Pricing */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#1C140E]">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-[#8A7A6E]">
                      {t.egp}
                    </span>
                  </div>
                  {product.originalPrice && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#9A8E83] line-through">
                        {product.originalPrice.toLocaleString()} {t.egp}
                      </span>
                      <span className="text-[11px] font-bold text-[#A74127]">
                        وفر {(product.originalPrice - product.price).toLocaleString()} {t.egp}
                      </span>
                    </div>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                    isWishlisted
                      ? 'bg-[#A74127] text-white border-[#A74127]'
                      : 'bg-white text-[#2C1D11] border-[#E0D7C9] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline-block">{t.wishlist}</span>
                </button>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
                {isAr ? product.description : product.descriptionEn}
              </p>

              {/* Color Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1A]">
                    {t.color}: <span className="text-[#8B5A2B]">{isAr ? selectedColor.name : selectedColor.nameEn}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedColor.name === color.name
                          ? 'border-[#2C1D11] bg-[#FAF8F5] ring-2 ring-[#C5A059]/40'
                          : 'border-[#E0D7C9] hover:border-[#8A7A6E]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{isAr ? color.name : color.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector + Size Guide Link */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1A]">
                    {t.size}: {selectedSize ? <span className="text-[#8B5A2B] font-black">{selectedSize} EU</span> : ''}
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-xs font-bold text-[#8B5A2B] hover:text-[#2C1D11] flex items-center gap-1 underline underline-offset-2"
                  >
                    <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{t.sizeGuide}</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const isLow = product.lowStockSizes?.includes(size);

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`h-11 rounded-xl text-xs sm:text-sm font-black border transition-all relative flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#2C1D11] text-[#FAF8F5] border-[#2C1D11] shadow-sm'
                            : 'bg-white text-[#2C1D11] border-[#E0D7C9] hover:border-[#C5A059]'
                        }`}
                      >
                        <span>{size}</span>
                        {isLow && (
                          <span className={`text-[8px] font-bold leading-none ${isSelected ? 'text-[#E7C785]' : 'text-amber-700'}`}>
                            {isAr ? 'آخر قطع' : 'Low'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {sizeError && (
                  <p className="text-xs font-bold text-rose-600 flex items-center gap-1 animate-bounce">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t.selectSizePrompt}</span>
                  </p>
                )}

                {isLowStock && (
                  <p className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    ⚡ {t.lastPairsPrompt}
                  </p>
                )}
              </div>

              {/* Quantity & Add to Cart / Buy Now Controls */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E0D7C9] rounded-xl bg-[#FAF8F5] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-[#2C1D11] hover:bg-[#EFE8DE]"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-black text-[#1A1A1A]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-[#2C1D11] hover:bg-[#EFE8DE]"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    id="modal-add-to-cart-btn"
                    type="button"
                    onClick={handleAddToCartClick}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                      addedSuccess
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#2C1D11] hover:bg-[#3D2817] text-[#FAF8F5]'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 animate-scale" />
                        <span>{t.addedToCart}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                        <span>{t.addToCart}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Buy Now Button */}
                <button
                  id="modal-buy-now-btn"
                  type="button"
                  onClick={handleBuyNowClick}
                  className="w-full py-3 px-4 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#140E0A] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.buyNow} (إتمام الشراء مباشرة)</span>
                </button>
              </div>

              {/* Product Specs List */}
              <div className="pt-4 border-t border-[#F0EBE1] space-y-2">
                <h4 className="text-xs font-bold text-[#1A1A1A]">
                  {t.features}:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5C4D42]">
                  {(isAr ? product.features : product.featuresEn).map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Reviews Section */}
              <div className="pt-4 border-t border-[#F0EBE1] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-[#1A1A1A]">
                    {t.reviews} ({product.reviews.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-xs font-bold text-[#8B5A2B] hover:text-[#2C1D11] underline"
                  >
                    {showReviewForm ? (isAr ? 'إلغاء' : 'Cancel') : `+ ${t.writeReview}`}
                  </button>
                </div>

                {/* Add Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-3 text-xs">
                    <p className="font-bold text-[#1A1A1A]">
                      {t.writeReview}:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={t.reviewAuthor}
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                        className="p-2 rounded-lg bg-white border border-[#E0D7C9] text-xs"
                      />
                      <input
                        type="text"
                        placeholder={t.reviewGov}
                        value={reviewGov}
                        onChange={(e) => setReviewGov(e.target.value)}
                        className="p-2 rounded-lg bg-white border border-[#E0D7C9] text-xs"
                      />
                    </div>
                    <div>
                      <span className="block mb-1 font-semibold text-[#5C4D42]">التقييم بالنجوم:</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-4 h-4 ${reviewRating >= star ? 'fill-current' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      placeholder={t.reviewComment}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={2}
                      className="w-full p-2 rounded-lg bg-white border border-[#E0D7C9] text-xs"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-[#2C1D11] text-[#FAF8F5] font-bold hover:bg-[#3D2817] transition-all"
                    >
                      {reviewSubmitted ? '✓ تم نشر تقييمك!' : t.submitReview}
                    </button>
                  </form>
                )}

                {/* Existing Reviews List */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8DE] space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#1A1A1A]">{rev.authorName}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded-sm font-semibold flex items-center gap-0.5">
                              <UserCheck className="w-2.5 h-2.5" />
                              <span>مشتري حقيقي</span>
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8A7A6E] block">
                        {rev.governorate} • {rev.date}
                      </span>
                      <p className="text-xs text-[#4A3B32] leading-snug">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
