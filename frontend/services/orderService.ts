import api from './api';

export const orderService = {
    createOrder: async (address: any) => {
        const response = await api.post('/orders/', { address });
        return response.data;
    },

    verifyPayment: async (paymentData: any) => {
        const response = await api.post('/orders/verify_payment/', paymentData);
        return response.data;
    },

    getOrders: async () => {
        const response = await api.get('/orders/');
        return response.data;
    }
};
