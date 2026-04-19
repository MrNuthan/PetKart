
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { username: string, email: string, password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  const loadUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setAuth(prev => ({ ...prev, user, isLoading: false }));
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error("Failed to load user", error);
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setAuth(prev => ({ ...prev, token: storedToken }));
      loadUser();
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const data = await authService.login(email, pass);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setAuth(prev => ({ ...prev, token: data.access }));
      await loadUser();
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (data: { username: string, email: string, password: string }) => {
    try {
      await authService.register(data);
      await login(data.email, data.password);
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    setAuth({ user: null, token: null, isLoading: false });
    window.location.hash = '#/login';
    window.location.reload();
  };

  const updateUser = async (data: Partial<User>) => {
    if (!auth.user) return;

    // Update local state immediately for responsiveness
    const newUser = { ...auth.user, ...data };
    setAuth(prev => ({ ...prev, user: newUser }));
    localStorage.setItem('user', JSON.stringify(newUser));

    // Persist to backend
    try {
      const backendPayload: Record<string, string> = {};
      if (data.firstName !== undefined) backendPayload.first_name = data.firstName;
      if (data.lastName !== undefined) backendPayload.last_name = data.lastName;
      if (data.email !== undefined) backendPayload.email = data.email;
      if (data.phone !== undefined) backendPayload.phone = data.phone;
      if (data.address !== undefined) backendPayload.address = data.address;

      const updatedUser = await authService.updateProfile(backendPayload);
      setAuth(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update profile on backend", error);
      // Revert on failure
      setAuth(prev => ({ ...prev, user: auth.user }));
      localStorage.setItem('user', JSON.stringify(auth.user));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
