
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  product_id?: string;
}

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

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  total_amount: number;
  status: string;
  payment_method: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  city: string;
  postal_code: string;
  created_at: string;
  items: OrderItem[];
}
