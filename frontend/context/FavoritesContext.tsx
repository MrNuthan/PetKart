
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { favoritesService } from '../services/favoritesService';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
    favorites: Product[];
    addToFavorites: (product: Product) => Promise<void>;
    removeFromFavorites: (productId: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (product: Product) => Promise<void>;
    syncFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const { user } = useAuth();

    const syncFavorites = async () => {
        if (user) {
            try {
                const favs = await favoritesService.getFavorites();
                // Backend returns array of {id, product, created_at}
                setFavorites(favs.map((f: any) => f.product));
            } catch (error) {
                console.error("Failed to sync favorites", error);
            }
        }
    };

    useEffect(() => {
        if (user) {
            syncFavorites();
        } else {
            // Load from localStorage for guest users
            const savedFavorites = localStorage.getItem('favorites');
            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));
            }
        }
    }, [user]);

    useEffect(() => {
        // Save to localStorage for guest users
        if (!user) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }, [favorites, user]);

    const addToFavorites = async (product: Product) => {
        if (user) {
            try {
                await favoritesService.addFavorite(product.id);
                await syncFavorites();
            } catch (error) {
                console.error("Failed to add to favorites", error);
            }
        } else {
            // Guest users: check if already exists
            setFavorites(prev => {
                const exists = prev.find(f => f.id === product.id);
                if (exists) return prev;
                return [...prev, product];
            });
        }
    };

    const removeFromFavorites = async (productId: string) => {
        if (user) {
            try {
                await favoritesService.removeFavorite(productId);
                await syncFavorites();
            } catch (error) {
                console.error("Failed to remove from favorites", error);
            }
        } else {
            setFavorites(prev => prev.filter(f => f.id !== productId));
        }
    };

    const isFavorite = (productId: string): boolean => {
        return favorites.some(f => f.id === productId);
    };

    const toggleFavorite = async (product: Product) => {
        if (isFavorite(product.id)) {
            await removeFromFavorites(product.id);
        } else {
            await addToFavorites(product);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite, syncFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
    return context;
};
