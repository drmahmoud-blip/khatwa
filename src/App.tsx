import React, { useState, useEffect, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Flame, 
  Hourglass, 
  ShoppingBag, 
  Heart, 
  Truck, 
  Eye, 
  Check, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { 
  Product, 
  CartItem, 
  WishlistItem, 
  Order, 
  FilterState, 
  Language, 
  ProductColor, 
  ProductReview, 
  Gender, 
  ShoeStyle, 
  CollectionType 
} from './types';
import { INITIAL_PRODUCTS, PROMO_CODES } from './data/products';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { FilterSidebar } from './components/FilterSidebar';
import { Footer } from './components/Footer';
import { AIChatAdvisor } from './components/AIChatAdvisor';

// Seed demo order for instant tracking test
const DEMO_INITIAL_ORDERS: Order[] = [
  {
    id: 'KTW-84920',
    items: [
      {
        id: 'ci-demo-1',
        product: INITIAL_PRODUCTS[0],
        selectedSize: 42,
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        quantity: 1,
      },
    ],
    customer: {
      fullName: 'محمود عبد الفتاح',
      phoneNumber: '01012345678',
      governorateId: 'cairo',
      city: 'القاهرة - مدينة نصر',
      address: 'شارع عباس العقاد، عمارة 14، الدور الرابع',
    },
    paymentMethod: 'cod',
    subtotal: 1450,
    discount: 0,
    shippingCost: 0,
    total: 1450,
    status: 'with_courier',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    trackingNumber: 'EG-84920-X',
    estimatedDelivery: 'اليوم خلال ساعات العمل',
  },
];

export default function App() {
  // Language & Direction
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('khatwa_lang') as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('khatwa_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = TRANSLATIONS[language];

  // Products state (allows adding customer reviews interactively)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      localStorage.removeItem('khatwa_products'); // Clean old cache
      const saved = localStorage.getItem('khatwa_products_v2');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        // Ensure kht-06 has the updated price 6000
        return parsed.map((p) => {
          const init = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          return init ? { ...p, price: init.price, originalPrice: init.originalPrice, discountPercent: init.discountPercent } : p;
        });
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('khatwa_products_v2', JSON.stringify(products));
  }, [products]);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('khatwa_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('khatwa_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Wishlist state
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('khatwa_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('khatwa_wishlist', JSON.stringify(wishlistProductIds));
  }, [wishlistProductIds]);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('khatwa_orders');
    return saved ? JSON.parse(saved) : DEMO_INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('khatwa_orders', JSON.stringify(orders));
  }, [orders]);

  // Active Promo Code
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    gender: 'all',
    style: 'all',
    collection: 'all',
    selectedSizes: [],
    selectedColors: [],
    priceRange: [400, 8000],
    searchQuery: '',
    sortBy: 'popularity',
  });

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [prefilledTrackingId, setPrefilledTrackingId] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Toast notifications for user actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, size: number, color: ProductColor, qty = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random()}`,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: qty,
        };
        return [...prev, newItem];
      }
    });

    showToast(`✓ تم إضافة ${product.name} إلى السلة!`);
  };

  const handleBuyNow = (product: Product, size: number, color: ProductColor, qty = 1) => {
    handleAddToCart(product, size, color, qty);
    setIsDetailModalOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistProductIds((prev) => {
      if (prev.includes(product.id)) {
        showToast('تمت إزالة الحذاء من المفضلة');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast('✓ تم حفظ الحذاء في المفضلة!');
        return [...prev, product.id];
      }
    });
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistProductIds.includes(p.id));
  }, [products, wishlistProductIds]);

  // Review Handler
  const handleAddReview = (productId: string, newReview: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;

        const review: ProductReview = {
          id: `rev-${Date.now()}`,
          ...newReview,
          date: 'الآن',
          verifiedPurchase: true,
        };

        const updatedReviews = [review, ...p.reviews];
        const avgRating = Number(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );

        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: avgRating,
        };
      })
    );
    showToast('شكراً لمشاركتك تقييمك مع مجتمع خطوة!');
  };

  // Promo Handlers
  const handleApplyPromo = (code: string) => {
    const found = PROMO_CODES[code];
    if (found) {
      setAppliedPromo(code);
      return { success: true, message: language === 'ar' ? found.descriptionAr : found.descriptionEn };
    }
    return { success: false, message: t.invalidCode };
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Checkout & Order Completion
  const handleCompleteOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedPromo(null);
    setIsCheckoutOpen(false);
    setLatestOrder(newOrder);
    setIsOrderSuccessOpen(true);
  };

  // Open Product Modal
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // Filter Update helper
  const handleUpdateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      gender: 'all',
      style: 'all',
      collection: 'all',
      selectedSizes: [],
      selectedColors: [],
      priceRange: [400, 8000],
      searchQuery: '',
      sortBy: 'popularity',
    });
  };

  // Filter and Sort Engine
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Gender filter
      if (filters.gender !== 'all' && p.gender !== filters.gender) {
        return false;
      }

      // Style filter
      if (filters.style !== 'all' && p.style !== filters.style) {
        return false;
      }

      // Collection filter
      if (filters.collection === 'new' && !p.isNew) {
        return false;
      }
      if (filters.collection === 'best_sellers' && !p.isBestSeller) {
        return false;
      }
      if (filters.collection === 'last_sizes' && !p.isLastSize) {
        return false;
      }
      if (filters.collection === 'sale' && !p.discountPercent) {
        return false;
      }

      // Price range filter
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
        return false;
      }

      // Size filter
      if (filters.selectedSizes.length > 0) {
        const hasMatchingSize = filters.selectedSizes.some((s) => p.sizes.includes(s));
        if (!hasMatchingSize) return false;
      }

      // Color filter
      if (filters.selectedColors.length > 0) {
        const hasMatchingColor = filters.selectedColors.some((cHex) =>
          p.colors.some((c) => c.hex.toLowerCase() === cHex.toLowerCase())
        );
        if (!hasMatchingColor) return false;
      }

      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.nameEn.toLowerCase().includes(query) ||
          p.style.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.price - b.price;
      if (filters.sortBy === 'price_high') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return b.reviewCount - a.reviewCount; // Popularity default
    });
  }, [products, filters]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-1/2 translate-x-1/2 z-50 bg-[#2C1D11] text-[#FAF8F5] px-5 py-2.5 rounded-2xl shadow-2xl border border-[#C5A059]/40 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistProductIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTrackOrder={() => setIsTrackingOpen(true)}
        products={products}
        onSelectProduct={handleSelectProduct}
        activeGender={filters.gender}
        onSelectGender={(g) => handleUpdateFilters({ gender: g })}
        activeStyle={filters.style}
        onSelectStyle={(s) => handleUpdateFilters({ style: s })}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => handleUpdateFilters({ searchQuery: q })}
      />

      {/* Hero Section (Only shown when not deeply searching) */}
      {!filters.searchQuery && filters.gender === 'all' && filters.style === 'all' && filters.collection === 'all' && (
        <HeroBanner
          language={language}
          onSelectGender={(g) => handleUpdateFilters({ gender: g })}
          onSelectCollection={(c) => handleUpdateFilters({ collection: c })}
        />
      )}

      {/* Category & Style Bar */}
      <CategoryNav
        language={language}
        activeGender={filters.gender}
        onSelectGender={(g) => handleUpdateFilters({ gender: g })}
        activeStyle={filters.style}
        onSelectStyle={(s) => handleUpdateFilters({ style: s })}
        activeCollection={filters.collection}
        onSelectCollection={(c) => handleUpdateFilters({ collection: c })}
      />

      {/* Flash Banner for Last Sizes or Sale */}
      {filters.collection === 'last_sizes' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-amber-900 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-amber-700 animate-spin" />
              <span>{t.lastSizesFomo}</span>
            </div>
            <button
              onClick={() => handleUpdateFilters({ collection: 'all' })}
              className="text-xs text-amber-800 underline"
            >
              عرض الكل
            </button>
          </div>
        </div>
      )}

      {/* Main Catalog & Filter Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Results Info & Mobile Filter Bar */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E8E1D5]">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#1A1A1A] flex items-center gap-2">
              <span>
                {filters.collection === 'new'
                  ? t.newArrivals
                  : filters.collection === 'best_sellers'
                  ? t.bestSellers
                  : filters.collection === 'last_sizes'
                  ? t.lastSizes
                  : filters.collection === 'sale'
                  ? t.offers
                  : filters.gender === 'men'
                  ? 'أحذية رجالي'
                  : filters.gender === 'women'
                  ? 'أحذية حريمي'
                  : t.allShoes}
              </span>
              <span className="text-xs font-bold text-[#8A7A6E]">
                ({filteredProducts.length} {t.itemsCount})
              </span>
            </h2>
            {filters.searchQuery && (
              <p className="text-xs text-[#8A7A6E] mt-0.5">
                نتائج البحث عن: "{filters.searchQuery}"
              </p>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            id="mobile-filter-open-btn"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E0D7C9] text-xs font-bold text-[#2C1D11] shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
            <span>{t.filterBy}</span>
          </button>
        </div>

        <div className="flex gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            language={language}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onResetFilters={handleResetFilters}
            totalMatches={filteredProducts.length}
          />

          {/* Product Cards Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E1D5] shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF5ED] flex items-center justify-center mx-auto text-[#8A7A6E]">
                  <ShoppingBag className="w-8 h-8 text-[#C5A059]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                  {t.noProductsFound}
                </h3>
                <p className="text-xs text-[#8A7A6E] max-w-sm mx-auto">
                  {t.tryChangingFilters}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#2C1D11] text-[#FAF8F5] text-xs font-bold hover:bg-[#3D2817] transition-all"
                >
                  {t.clearFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    isWishlisted={wishlistProductIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={handleSelectProduct}
                    onQuickAddToCart={(prod, size, col) => handleAddToCart(prod, size, col, 1)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Floating Mobile Sticky Bar for quick checkout / cart trigger */}
      <div className="fixed bottom-3 inset-x-4 z-30 lg:hidden flex items-center justify-between p-2.5 rounded-2xl bg-[#2C1D11]/95 backdrop-blur-md text-white shadow-2xl border border-[#C5A059]/40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white relative"
          >
            <Heart className="w-4 h-4" />
            {wishlistProductIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#A74127] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistProductIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsTrackingOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#E7C785] bg-white/10 px-2.5 py-1.5 rounded-xl"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t.trackOrder}</span>
          </button>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A059] text-[#121212] font-black text-xs shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {cartCount > 0 ? `${cartCount} قطع (${cartTotal} ${t.egp})` : t.cart}
          </span>
        </button>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        language={language}
        isWishlisted={selectedProduct ? wishlistProductIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onAddReview={handleAddReview}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        language={language}
        initialGender={selectedProduct?.gender || 'men'}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        language={language}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        language={language}
        items={cartItems}
        appliedPromo={appliedPromo}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={latestOrder}
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        language={language}
        onTrackOrder={(orderId) => {
          setPrefilledTrackingId(orderId);
          setIsTrackingOpen(true);
        }}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        language={language}
        orders={orders}
        prefilledOrderId={prefilledTrackingId}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        language={language}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
        onAddToCart={(prod, size, col) => handleAddToCart(prod, size, col, 1)}
      />

      {/* Footer */}
      <Footer
        language={language}
        onOpenTrackOrder={() => setIsTrackingOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onSelectCollection={(coll) => handleUpdateFilters({ collection: coll })}
      />

      {/* AI Customer Shopping Advisor Chatbot */}
      <AIChatAdvisor
        language={language}
        products={products}
        onSelectProduct={handleSelectProduct}
        onAddToCart={(prod, size, col) => handleAddToCart(prod, size, col, 1)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenTrackOrder={() => setIsTrackingOpen(true)}
      />

    </div>
  );
}

