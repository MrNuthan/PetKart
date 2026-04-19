import api from './api';

// ─── Types ───────────────────────────────────────────────
export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  salesData: { name: string; sales: number; date: string }[];
  recentActivity: {
    id: number;
    customer: string;
    amount: number;
    status: string;
    created_at: string;
  }[];
}

export interface AdminOrder {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  payment_method: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  created_at: string;
  items: {
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    product_image: string | null;
  }[];
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  rating: number;
  featured: boolean;
  category: number;
  category_name: string;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  phone: string;
  address: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  order_count: number;
}

export interface AdminReview {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  product: number;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

// ─── API Functions ───────────────────────────────────────

export const adminService = {
  // Dashboard
  fetchAnalytics: async (): Promise<Analytics> => {
    const res = await api.get('/admin/dashboard/analytics/');
    return res.data;
  },

  // Orders
  fetchOrders: async (): Promise<AdminOrder[]> => {
    const res = await api.get('/admin/orders/');
    return res.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<AdminOrder> => {
    const res = await api.patch(`/admin/orders/${id}/update-status/`, { status });
    return res.data;
  },

  // Products
  fetchProducts: async (): Promise<AdminProduct[]> => {
    const res = await api.get('/admin/products/');
    return res.data;
  },

  createProduct: async (data: FormData): Promise<AdminProduct> => {
    const res = await api.post('/admin/products/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateProduct: async (id: number, data: FormData): Promise<AdminProduct> => {
    const res = await api.patch(`/admin/products/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}/`);
  },

  // Categories
  fetchCategories: async (): Promise<CategoryItem[]> => {
    const res = await api.get('/admin/categories/');
    return res.data;
  },

  // Users
  fetchUsers: async (): Promise<AdminUser[]> => {
    const res = await api.get('/admin/users/');
    return res.data;
  },

  // Reviews
  fetchReviews: async (): Promise<AdminReview[]> => {
    const res = await api.get('/admin/reviews/');
    return res.data;
  },

  deleteReview: async (id: number): Promise<void> => {
    await api.delete(`/admin/reviews/${id}/`);
  },
};
