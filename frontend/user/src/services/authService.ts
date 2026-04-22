import api from '../lib/api';
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
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/users/login/', { email, password });
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/users/register/', {
      username: data.username,
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/profile/');
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
    const response = await api.put('/users/profile/', profileData);
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
