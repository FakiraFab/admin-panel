// Phase 2 Type Definitions for Admin Panel

// ============================================================================
// User Management Types
// ============================================================================

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  addressCount: number;
  cartItemsCount: number;
  wishlistItemsCount: number;
}

export interface UserSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'customer' | 'admin';
  isActive?: boolean;
  isEmailVerified?: boolean;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Enhanced Order Types
// ============================================================================

export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shipping: ShippingInfo;
  pricing: OrderPricing;
  statusHistory: StatusHistoryItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryDate?: string;
}

export interface OrderItem {
  product: string;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
  options?: Record<string, any>;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface ShippingInfo {
  provider: string;
  shiprocketOrderId?: string;
  shipmentId?: string;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  status: 'not_created' | 'created' | 'awb_assigned' | 'picked' | 'in_transit' | 'delivered' | 'rto' | 'cancelled';
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  taxRate: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface OrderSearchParams {
  page?: number;
  limit?: number;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  shippingStatus?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface Payment {
  _id: string;
  order: string | Order;
  user: string | User;
  amount: number;
  currency: string;
  paymentMethod: 'razorpay' | 'cod';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  failureReason?: string;
  refundDetails?: RefundDetails;
  createdAt: string;
  updatedAt: string;
}

export interface RefundDetails {
  refundId: string;
  amount: number;
  reason: string;
  status: string;
  processedAt: string;
}

export interface RefundRequest {
  amount: number;
  reason: string;
  notes?: string;
}

export interface PaymentSearchParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
  orderNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
