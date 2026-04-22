import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Shield, Truck, RotateCcw, Plus, Minus, ShoppingBag, Check, Heart, ChevronLeft
} from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Toast, { ToastType } from '../components/Toast';
import { cn } from '../lib/utils';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await productService.getProduct(id);
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.image);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      setAddedToCart(true);
      setToast({ message: `${product.name} added to cart!`, type: 'success' });
      setTimeout(() => { setAddedToCart(false); setIsAddingToCart(false); }, 2000);
    } catch {
      setIsAddingToCart(false);
      setToast({ message: 'Failed to add to cart. Please try again.', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Product not found.</h2>
        <Link to="/" className="text-primary font-bold hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(product.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-8 pb-20 bg-white min-h-screen"
    >
      {toast && (
        <Toast message={toast.message} type={toast.type} isVisible={!!toast} onClose={closeToast} />
      )}

      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-primary font-medium transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-500 font-medium">{product.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 aspect-square">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80';
                  }}
                />
              </AnimatePresence>
            </div>
            {/* Thumbnails */}
            {(product.images || []).length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images!.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      'flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all',
                      selectedImage === img
                        ? 'border-primary shadow-lg shadow-primary/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category + Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    )}
                  />
                ))}
                <span className="text-sm text-slate-400 ml-1">({product.rating})</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-primary">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            </div>

            <p className="text-slate-500 leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full', product.stock > 0 ? 'bg-emerald-400' : 'bg-red-400')} />
              <span className={cn('text-sm font-semibold', product.stock > 0 ? 'text-emerald-600' : 'text-red-500')}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-black text-slate-900 min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-3 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-slate-400 font-medium">Max {product.stock} units</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                whileTap={!isAddingToCart ? { scale: 0.97 } : {}}
                className={cn(
                  'flex-1 py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg text-white',
                  addedToCart
                    ? 'bg-emerald-500 shadow-emerald-500/20'
                    : 'bg-primary hover:bg-primary/90 shadow-primary/20',
                  (isAddingToCart || product.stock === 0) && 'opacity-60 cursor-not-allowed'
                )}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <Check className="w-5 h-5" /> Added to Cart
                    </motion.span>
                  ) : isAddingToCart ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                onClick={() => toggleFavorite(product)}
                className={cn(
                  'p-4 rounded-2xl border-2 transition-all',
                  isFav
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-400'
                )}
              >
                <Heart className={cn('w-5 h-5', isFav && 'fill-red-500')} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              {[
                { icon: Truck, label: 'Free Delivery', sub: '48-72 hrs' },
                { icon: Shield, label: '2yr Warranty', sub: 'Covered' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30 days' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  <span className="text-[10px] text-slate-400">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
