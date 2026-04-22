import api from '../lib/api';
import { Product } from '../types';

export const productService = {
  getProducts: async (category?: string, search?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const response = await api.get<Product[]>(`/products/?${params.toString()}`);
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}/`);
    return response.data;
  },

  getCategories: async (): Promise<{ id: number; name: string; slug: string }[]> => {
    const response = await api.get('/categories/');
    return response.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/?featured=true');
    return response.data;
  },
};
