export type Gender = 'all' | 'men' | 'women';

export type ShoeStyle = 'all' | 'casual' | 'sport' | 'classic' | 'loafers' | 'boots' | 'sandals';

export type CollectionType = 'all' | 'new' | 'best_sellers' | 'sale' | 'last_sizes';

export interface ProductColor {
  name: string;
  nameEn: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  authorName: string;
  governorate: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  gender: 'men' | 'women';
  style: ShoeStyle;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  hoverImage: string;
  lifestyleImage: string;
  colors: ProductColor[];
  sizes: number[];
  lowStockSizes?: number[];
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  material: string;
  soleMaterial: string;
  madeIn: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isLastSize?: boolean;
  tags?: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: number;
  selectedColor: ProductColor;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  shippingCost: number;
  deliveryDays: string;
}

export type PaymentMethod = 'cod' | 'instapay' | 'vodafone_cash' | 'card';

export interface OrderCustomerInfo {
  fullName: string;
  phoneNumber: string;
  altPhoneNumber?: string;
  governorateId: string;
  city: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: OrderCustomerInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  promoCode?: string;
  status: 'confirmed' | 'preparing' | 'with_courier' | 'delivered';
  createdAt: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface FilterState {
  gender: Gender;
  style: ShoeStyle;
  collection: CollectionType;
  selectedSizes: number[];
  selectedColors: string[];
  priceRange: [number, number];
  searchQuery: string;
  sortBy: 'popularity' | 'price_low' | 'price_high' | 'rating' | 'newest';
}

export type Language = 'ar' | 'en';
