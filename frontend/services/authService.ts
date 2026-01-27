import api from './api';
import { User } from '../types';

interface LoginResponse {
    access: string;
    refresh: string;
    user: User; // Assuming backend returns user info on login, if not we fetch it separately
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
        // User model USERNAME_FIELD is 'email', so SimpleJWT expects 'email' key in payload.
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

    getCurrentUser: async () => {
        const response = await api.get('/users/me/');
        const data = response.data;
        return {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            avatar: data.avatar // assuming avatar key matches or is handled similarly
        };
    },
};
