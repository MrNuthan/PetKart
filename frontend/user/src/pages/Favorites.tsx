import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ChevronLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    try {
      await addToCart(product);
    } finally {
      setTimeout(() => setAddingToCart(null), 800);
    }
  };

  const handleMoveAllToCart = async () => {
    for (const product of favorites) {
      await addToCart(product);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm max-w-sm w-full p-12 text-center"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">No favorites yet</h2>
          <p className="text-slate-400 text-sm mb-8">
            Save products you love and find them here instantly.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors mb-8 text-sm font-semibold group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7 text-red-500 fill-red-500" />
            <div>
              <h1 className="text-3xl font-black text-slate-900">My Favorites</h1>
              <p className="text-slate-400 text-sm">{favorites.length} items saved</p>
            </div>
          </div>
          <motion.button
            onClick={handleMoveAllToCart}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all text-sm shadow-lg shadow-primary/20"
          >
            <ShoppingCart className="w-4 h-4" />
            Move All to Cart
          </motion.button>
        </div>

        {/* Favorites List */}
        <div className="space-y-4 max-w-3xl">
          <AnimatePresence mode="popLayout">
            {favorites.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30, height: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex items-center gap-5"
              >
                {/* Image */}
                <Link to={`/product/${product.id}`}
                  className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 relative group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&q=80';
                    }}
                  />
                  {addingToCart === product.id && (
                    <div className="absolute inset-0 bg-primary/30 backdrop-blur-[2px] flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white animate-bounce" />
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {product.category}
                  </span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-slate-900 text-sm hover:text-primary transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-400 line-clamp-1 hidden sm:block">{product.description}</p>
                  <p className="font-black text-slate-900 mt-1">₹{product.price}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all text-xs shadow-md shadow-primary/20 disabled:opacity-60"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {addingToCart === product.id ? 'Added!' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
