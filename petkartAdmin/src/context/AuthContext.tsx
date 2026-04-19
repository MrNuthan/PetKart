import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAdmin: false,
  });

  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/users/me/');
      const user = res.data;
      
      if (!user.is_staff) {
        // Non-admin user — reject
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_user');
        setAuth({ user: null, token: null, isLoading: false, isAdmin: false });
        return;
      }

      localStorage.setItem('admin_user', JSON.stringify(user));
      setAuth(prev => ({
        ...prev,
        user,
        isAdmin: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to load admin user', error);
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_access_token');
    if (storedToken) {
      setAuth(prev => ({ ...prev, token: storedToken }));
      loadUser();
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/token/', { email, password });
    const { access, refresh } = response.data;

    localStorage.setItem('admin_access_token', access);
    localStorage.setItem('admin_refresh_token', refresh);
    setAuth(prev => ({ ...prev, token: access }));

    // Verify the user is admin
    const userRes = await api.get('/users/me/', {
      headers: { Authorization: `Bearer ${access}` },
    });
    const user = userRes.data;

    if (!user.is_staff) {
      // Reject non-admin login
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      throw new Error('ACCESS_DENIED');
    }

    localStorage.setItem('admin_user', JSON.stringify(user));
    setAuth({
      user,
      token: access,
      isLoading: false,
      isAdmin: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    setAuth({ user: null, token: null, isLoading: false, isAdmin: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
