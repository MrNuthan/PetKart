import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CartState } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Helper: localStorage cart ────────────────────────────────────────────
const CART_KEY = 'petkart_guest_cart';

const loadLocalCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveLocalCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  // FIX #3: Get both user AND isLoading from auth so we wait for auth to resolve
  const { user, isLoading: authLoading } = useAuth();

  const syncCart = async () => {
    try {
      const cartItems = await cartService.getCart();
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to sync cart from backend', error);
    }
  };

  // FIX #3: Only trigger cart load after auth has fully resolved
  useEffect(() => {
    if (authLoading) return; // Wait until we know if user is logged in or not

    if (user) {
      // Logged-in: pull from backend
      syncCart();
    } else {
      // Guest: load from localStorage
      setItems(loadLocalCart());
    }
  }, [user, authLoading]);

  // Persist guest cart to localStorage whenever it changes
  useEffect(() => {
    if (!user && !authLoading) {
      saveLocalCart(items);
    }
  }, [items, user, authLoading]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (user) {
      await cartService.addToCart(product.id, quantity);
      await syncCart();
    } else {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      await cartService.removeFromCart(productId);
      await syncCart();
    } else {
      setItems((prev) => prev.filter((i) => i.id !== productId));
    }
  };

  const updateQuantity = async (productId: string, delta: number) => {
    if (user) {
      const item = items.find((i) => i.product_id === productId || i.id === productId);
      if (item) {
        const newQty = item.quantity + delta;
        if (newQty > 0) {
          await cartService.updateCartItem(item.id, newQty);
          await syncCart();
        } else {
          // Remove the item if quantity hits 0
          await cartService.removeFromCart(item.id);
          await syncCart();
        }
      }
    } else {
      setItems((prev) =>
        prev
          .map((i) => {
            if (i.id === productId) {
              return { ...i, quantity: Math.max(0, i.quantity + delta) };
            }
            return i;
          })
          .filter((i) => i.quantity > 0)
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Failed to clear cart on backend', error);
      }
    }
    setItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const totalAmount = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalAmount, addToCart, removeFromCart, updateQuantity, clearCart, syncCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
