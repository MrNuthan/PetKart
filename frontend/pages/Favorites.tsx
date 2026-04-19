
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ChevronLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

const Favorites: React.FC = () => {
    const { favorites, removeFromFavorites } = useFavorites();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [removingItem, setRemovingItem] = useState<string | null>(null);

    const handleAddToCart = async (product: any) => {
        setAddingToCart(product.id);
        await addToCart(product);
        setTimeout(() => setAddingToCart(null), 800);
    };

    const handleRemove = async (productId: string) => {
        setRemovingItem(productId);
        setTimeout(async () => {
            await removeFromFavorites(productId);
            setRemovingItem(null);
        }, 300);
    };

    const handleMoveAllToCart = async () => {
        for (const product of favorites) {
            await addToCart(product);
        }
    };

    if (favorites.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-24 pb-20 max-w-7xl mx-auto px-4 text-center"
            >
                <div className="glass max-w-md mx-auto p-12 md:p-16 rounded-[2.5rem] border border-white/5">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary-coral/20 blur-3xl rounded-full opacity-30 animate-pulse" />
                        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-coral/20 to-primary/20 rounded-full flex items-center justify-center mx-auto border border-white/10">
                            <Heart className="w-10 h-10 md:w-12 md:h-12 text-primary-coral" />
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Your favorites list is empty</h2>
                    <p className="text-zinc-400 text-sm md:text-base mb-8 leading-relaxed">
                        Start adding products you love to your favorites for quick access later!
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-8 py-4 aura-btn text-white font-bold rounded-full text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-lg"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Browse Products
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="pt-24 pb-20 overflow-x-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-zinc-500 hover:text-white transition-colors mb-6 md:mb-8 group text-sm"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                    Back to browsing
                </button>

                {/* Header with Move All Button */}
                <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Heart className="w-6 h-6 md:w-8 md:h-8 text-primary-coral fill-primary-coral" />
                            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
                                My <span className="text-primary-coral">Favorites</span>
                            </h1>
                        </div>
                        <p className="text-zinc-400 text-sm md:text-base">
                            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>

                    <motion.button
                        onClick={handleMoveAllToCart}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Move All to Cart
                    </motion.button>
                </div>

                {/* Favorites Items List */}
                <div className="space-y-4 md:space-y-6 max-w-4xl">
                    <AnimatePresence mode="popLayout">
                        {favorites.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30, height: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className={`glass p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 flex flex-row items-center space-x-4 md:space-x-6 transition-all duration-300 ${
                                    addingToCart === product.id
                                        ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/20'
                                        : ''
                                }`}
                            >
                                {/* Product Image */}
                                <div
                                    className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 cursor-pointer group relative"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {addingToCart === product.id && (
                                        <div className="absolute inset-0 bg-primary/30 backdrop-blur-[1px] flex items-center justify-center">
                                            <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-white animate-bounce" />
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                    <span className="text-[8px] md:text-[10px] text-primary uppercase font-bold tracking-widest">
                                        {product.category}
                                    </span>
                                    <h3
                                        className="text-sm md:text-xl font-bold text-white mb-0.5 md:mb-1 truncate cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        {product.name}
                                    </h3>
                                    <p className="hidden sm:block text-zinc-500 text-xs md:text-sm line-clamp-1 mb-2">
                                        {product.description}
                                    </p>
                                    <p className="text-sm md:text-xl font-bold text-white">₹{product.price}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end space-y-2 md:space-y-3">
                                    <motion.button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={addingToCart === product.id}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex items-center px-3 md:px-4 py-2 md:py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg md:rounded-xl transition-all text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-primary/20 ${
                                            addingToCart === product.id
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:scale-105'
                                        }`}
                                    >
                                        <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                        {addingToCart === product.id ? 'Added!' : 'Add to Cart'}
                                    </motion.button>

                                    <motion.button
                                        onClick={() => handleRemove(product.id)}
                                        disabled={removingItem === product.id}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center text-[8px] md:text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-widest disabled:opacity-50"
                                    >
                                        <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                        Remove
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Favorites;
