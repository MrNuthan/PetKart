import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, Heart, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAdded, setIsAdded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        setIsAddingToCart(false);
      }, 1500);
    } catch {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTogglingFav) return;
    setIsTogglingFav(true);
    try {
      await toggleFavorite(product);
    } finally {
      setIsTogglingFav(false);
    }
  };

  const isFav = isFavorite(product.id);
  const outOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 flex flex-col border border-slate-100"
    >
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        onClick={onViewDetails ? (e) => { e.preventDefault(); onViewDetails(product); } : undefined}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-50"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80';
          }}
        />

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest">
              Out of Stock
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleToggleFav}
          disabled={isTogglingFav}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all',
            isFav ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-400'
          )}
        >
          <Heart className={cn('w-4 h-4', isFav && 'fill-white')} />
        </button>

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
            Featured
          </div>
        )}

        {/* Add to Cart overlay on hover */}
        {!outOfStock && (
          <motion.button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1 whitespace-nowrap shadow-lg',
              isAdded
                ? 'bg-emerald-500'
                : 'bg-slate-900 hover:bg-slate-800'
            )}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Added!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <ShoppingCart className="w-3 h-3" /> Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-bold text-slate-500">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">{product.description}</p>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-base font-black text-slate-900">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || outOfStock}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
              isAdded
                ? 'bg-emerald-500 text-white'
                : outOfStock
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
            )}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
