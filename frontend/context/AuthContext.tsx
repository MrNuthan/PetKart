
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { username: string, email: string, password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
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
      await login(data.username, data.password);
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuth({ user: null, token: null, isLoading: false });
    window.location.href = '/login';
  };

  const updateUser = (data: Partial<User>) => {
    if (auth.user) {
      const newUser = { ...auth.user, ...data };
      setAuth(prev => ({ ...prev, user: newUser }));
      localStorage.setItem('user', JSON.stringify(newUser));
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
