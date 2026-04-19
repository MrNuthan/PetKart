import api from './api';
import { User } from '../types';

interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/token/', { email, password });
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/users/', {
            username: data.username,
            email: data.email,
            password: data.password,
            first_name: data.firstName,
            last_name: data.lastName,
        });
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get('/users/me/');
        const data = response.data;
        return {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            avatar: data.avatar,
            phone: data.phone || '',
            address: data.address || '',
        };
    },

    updateProfile: async (profileData: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        address?: string;
    }): Promise<User> => {
        const response = await api.patch('/users/update_profile/', profileData);
        const data = response.data;
        return {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            avatar: data.avatar,
            phone: data.phone || '',
            address: data.address || '',
        };
    },
};
