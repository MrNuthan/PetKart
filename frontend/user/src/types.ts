// ─── Pet Categories ────────────────────────────────────────────────────────
export type PetCategory = 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'All';

// ─── Product ───────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;        // use string to match Django category names
  rating: number;
  reviews?: number;
  stock: number;
  featured?: boolean;
  tags?: string[];
}

// ─── Cart ──────────────────────────────────────────────────────────────────
export interface CartItem extends Product {
  quantity: number;
  product_id?: string;    // backend cart item identifier
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// ─── Address ───────────────────────────────────────────────────────────────
export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'Placed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  id: number;
  product_id?: number;      // backend: product.id, used for the review form
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  razorpay_order_id?: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  city: string;
  postal_code: string;
  created_at: string;
  items: OrderItem[];
}
