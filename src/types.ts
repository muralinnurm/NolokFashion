export type ProductCategory =
  | 'Dresses & Co-ords'
  | 'Kurtis & Tunics'
  | 'Sarees'
  | 'Three-Piece Suits'
  | 'Modest Fashion'
  | 'Western Wear'
  | 'Festive Collections'
  | 'Bags & Accessories';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  price: number; // in BDT (৳)
  compareAtPrice?: number;
  boutiqueId: string;
  boutiqueName: string;
  category: ProductCategory;
  subcategory: string;
  images: string[];
  description: string;
  fabric: string;
  care: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  sku: string;
  status: 'published' | 'draft' | 'pending';
  condition: 'Brand New' | 'Artisan Handloom' | 'Boutique Exclusive';
  isNewArrival?: boolean;
  isEditorsPick?: boolean;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Boutique {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  location: string;
  division: string;
  logo: string;
  banner: string;
  categories: ProductCategory[];
  totalProducts: number;
  rating: number;
  ordersFulfilled: number;
  joinedDate: string;
  deliveryCoverage: string;
  processingTime: string;
  policies: {
    shipping: string;
    returns: string;
  };
  isApproved: boolean;
  status: 'active' | 'pending' | 'suspended';
  phone?: string;
  email?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface SellerOrderGroup {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
  status: OrderStatus;
  courier?: string;
  trackingNumber?: string;
  dispatchedAt?: string;
  deliveryNotes?: string;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  area: string;
  streetAddress: string;
  deliveryInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerAddress;
  deliveryMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDelivery: string;
  };
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentStatus: 'pending' | 'paid' | 'verified_on_delivery';
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  sellerGroups: SellerOrderGroup[];
  overallStatus: OrderStatus;
}

export interface SellerApplication {
  id: string;
  fullName: string;
  shopName: string;
  email: string;
  phone: string;
  description: string;
  pickupAddress: string;
  division: string;
  categories: ProductCategory[];
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number; // percentage (e.g. 10 for 10%) or flat amount in BDT (e.g. 200)
  minOrder: number;
  validUntil: string;
  isActive: boolean;
}

export interface CustomerReview {
  id: string;
  productId: string;
  customerName: string;
  customerCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface PlatformSettings {
  announcementText: string;
  announcementVisible: boolean;
  commissionRatePercent: number;
  heroHeadline: string;
  heroSubtext: string;
  dhakaDeliveryFee: number;
  outsideDhakaDeliveryFee: number;
  expressDhakaDeliveryFee: number;
}
