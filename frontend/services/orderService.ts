import api from './api';
import { Order } from '../types';

export interface CreateOrderPayload {
    address_line_1: string;
    city: string;
    postal_code: string;
    first_name: string;
    last_name: string;
    state?: string;
    phone?: string;
    payment_method: 'razorpay' | 'cod';
}

export interface OrderResponse {
    id: number;
    total_amount: number;
    status: string;
    payment_method: string;
    razorpay_order_id?: string;
    first_name: string;
    last_name: string;
    address_line_1: string;
    city: string;
    postal_code: string;
    created_at: string;
    items: any[];
}

export const orderService = {
    /**
     * Create an order on the backend.
     * IMPORTANT: The backend endpoint is /orders/create_order/ (custom action),
     * NOT the default /orders/ (which is a list endpoint).
     * The body must be FLAT fields — not wrapped in { address: {...} }.
     */
    createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
        try {
            const response = await api.post('/orders/create_order/', payload);
            return response.data;
        } catch (error: any) {
            const backendMessage =
                error?.response?.data?.error ||
                error?.response?.data?.detail ||
                error?.message ||
                'Unknown error creating order';
            console.error('[OrderService] createOrder failed:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: backendMessage,
            });
            throw new Error(backendMessage);
        }
    },

    verifyPayment: async (paymentData: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => {
        try {
            const response = await api.post('/orders/verify_payment/', paymentData);
            return response.data;
        } catch (error: any) {
            const backendMessage =
                error?.response?.data?.error ||
                error?.response?.data?.detail ||
                error?.message ||
                'Payment verification failed';
            console.error('[OrderService] verifyPayment failed:', {
                status: error?.response?.status,
                data: error?.response?.data,
            });
            throw new Error(backendMessage);
        }
    },

    getOrders: async (): Promise<Order[]> => {
        try {
            const response = await api.get('/orders/');
            // Handle both paginated and non-paginated responses
            const data = response.data;
            if (Array.isArray(data)) return data;
            if (data.results && Array.isArray(data.results)) return data.results;
            return [];
        } catch (error: any) {
            console.error('[OrderService] getOrders failed:', error);
            throw new Error(error?.response?.data?.detail || 'Failed to fetch orders');
        }
    }
};
