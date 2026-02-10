// BunBunClothing - TypeScript Types
// Generated from Data Model

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  images: ProductImage[];
  variants: ProductVariant[];
  basePrice: number;
  salePrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  fabric?: string;
  careInstructions?: string;
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  couponCode?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'office' | 'other';
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantInfo: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  productIds: string[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageDesktop: string;
  imageMobile?: string;
  linkUrl: string;
  linkText?: string;
  order: number;
  isActive: boolean;
  validFrom?: Date;
  validTo?: Date;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerImage?: string;
  location: string;
  rating: number;
  content: string;
  productId?: string;
  isApproved: boolean;
  createdAt: Date;
}
