import api from './api';

export const cartService = {
    getCart: async () => {
        const response = await api.get('/cart/');
        // Transform the nested backend response to match frontend CartItem interface
        return response.data.items.map((item: any) => ({
            ...item.product,
            product_id: item.product.id,
            id: item.product.id,
            quantity: item.quantity
        }));
    },

    addToCart: async (productId: string, quantity: number = 1) => {
        const response = await api.post('/cart/add_item/', { product_id: productId, quantity });
        return response.data;
    },

    updateCartItem: async (productId: string, quantity: number) => {
        const response = await api.post('/cart/update_item/', { product_id: productId, quantity });
        return response.data;
    },

    removeFromCart: async (productId: string) => {
        await api.post('/cart/remove_item/', { product_id: productId });
    },

    clearCart: async () => {
        await api.post('/cart/clear/');
    }
};
