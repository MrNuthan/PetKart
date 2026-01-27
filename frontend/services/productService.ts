import api from './api';
import { Product } from '../types';

export const productService = {
    getProducts: async (category?: string, search?: string) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('search', search);
        const response = await api.get<Product[]>(`/products/?${params.toString()}`);
        return response.data;
    },

    getProduct: async (id: string) => {
        const response = await api.get<Product>(`/products/${id}/`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get<{ id: number, name: string, slug: string }[]>('/categories/');
        return response.data;
    },

    getFeaturedProducts: async () => {
        // Assuming backend supports filtering by featured or we filter on frontend
        const response = await api.get<Product[]>('/products/?featured=true');
        return response.data;
    }
};
