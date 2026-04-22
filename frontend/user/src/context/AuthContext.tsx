import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
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

  const clearAuthData = () => {
    // Access token lives in sessionStorage (cleared on tab/browser close).
    // Refresh token lives in localStorage (persists across refreshes within session).
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setAuth({ user: null, token: null, isLoading: false });
  };

  const loadUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setAuth((prev) => ({ ...prev, user, isLoading: false }));
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to load user — clearing stale session', error);
      // Clear everything: the token is invalid and refresh also failed
      clearAuthData();
    }
  };

  useEffect(() => {
    // Access token is stored in sessionStorage — it only survives within the
    // current browser session (same tab/window). When the user opens a fresh
    // link in a new tab or restarts the browser, sessionStorage is empty and
    // they start as a guest. This prevents the "already logged in" symptom.
    const storedToken = sessionStorage.getItem('access_token');
    if (storedToken && storedToken.length > 10) {
      setAuth((prev) => ({ ...prev, token: storedToken }));
      loadUser();
    } else {
      // No valid token found — ensure clean state
      if (storedToken) {
        // Corrupted or empty token — clean up
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
      setAuth((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await authService.login(email, pass);
    sessionStorage.setItem('access_token', data.access);  // session-only
    localStorage.setItem('refresh_token', data.refresh);   // persists within session
    setAuth((prev) => ({ ...prev, token: data.access }));
    await loadUser();
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    await authService.register(data);
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('access_token');  // session token
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    setAuth({ user: null, token: null, isLoading: false });
    // Navigate to login
    window.location.hash = '#/login';
    window.location.reload();
  };

  const updateUser = async (data: Partial<User>) => {
    if (!auth.user) return;

    // Optimistic update
    const newUser = { ...auth.user, ...data };
    setAuth((prev) => ({ ...prev, user: newUser }));
    localStorage.setItem('user', JSON.stringify(newUser));

    // Persist to backend
    const backendPayload: Record<string, string> = {};
    if (data.firstName !== undefined) backendPayload.first_name = data.firstName;
    if (data.lastName !== undefined) backendPayload.last_name = data.lastName;
    if (data.email !== undefined) backendPayload.email = data.email;
    if (data.phone !== undefined) backendPayload.phone = data.phone;
    if (data.address !== undefined) backendPayload.address = data.address;

    const updatedUser = await authService.updateProfile(backendPayload);
    setAuth((prev) => ({ ...prev, user: updatedUser }));
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
