
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const syncCart = async () => {
    try {
      const cartItems = await cartService.getCart();
      setItems(cartItems);
    } catch (error) {
      console.error("Failed to sync cart", error);
    }
  };

  useEffect(() => {
    if (user) {
      syncCart();
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) setItems(JSON.parse(savedCart));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (user) {
      try {
        await cartService.addToCart(product.id, quantity);
        await syncCart();
      } catch (error) {
        console.error("Failed to add to cart", error);
        throw error; // Re-throw so callers can handle it
      }
    } else {
      setItems(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) {
          return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        await cartService.removeFromCart(productId);
        await syncCart();
      } catch (error) {
        console.error("Failed to remove from cart", error);
      }
    } else {
      setItems(prev => prev.filter(i => i.id !== productId));
    }
  };

  const updateQuantity = async (productId: string, delta: number) => {
    if (user) {
      try {
        const item = items.find(i => i.product_id === productId || i.id === productId);
        if (item) {
          const newQty = item.quantity + delta;
          if (newQty > 0) {
            await cartService.updateCartItem(item.id, newQty);
            await syncCart();
          }
        }
      } catch (error) {
        console.error("Failed to update quantity", error);
      }
    } else {
      setItems(prev => prev.map(i => {
        if (i.id === productId) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      }));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error("Failed to clear cart on backend", error);
      }
    }
    // Always clear local state
    setItems([]);
    if (!user) {
      localStorage.removeItem('cart');
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalAmount, addToCart, removeFromCart, updateQuantity, clearCart, syncCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
