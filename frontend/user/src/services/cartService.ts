import api from '../lib/api';
import { CartItem } from '../types';

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart/');
    // Backend returns { items: [{product: {...}, quantity: N}] }
    return response.data.items.map((item: any) => ({
      ...item.product,
      product_id: item.product.id,
      id: item.product.id,
      quantity: item.quantity,
    }));
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await api.post('/cart/add/', { product_id: productId, quantity });
    return response.data;
  },

  updateCartItem: async (productId: string, quantity: number) => {
    const response = await api.put('/cart/update/', { product_id: productId, quantity });
    return response.data;
  },

  removeFromCart: async (productId: string) => {
    await api.delete(`/cart/remove/${productId}/`);
  },

  clearCart: async () => {
    await api.delete('/cart/clear/');
  },
};
