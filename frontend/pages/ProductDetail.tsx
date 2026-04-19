
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Shield, Truck, RotateCcw, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Toast, { ToastType } from '../components/Toast';

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

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await productService.getProduct(id);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        } else {
          setSelectedImage(data.image);
        }
      } catch (error) {
        console.error("Failed to load product", error);
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
      setToast({ message: `${product.name} added to your cart!`, type: 'success' });

      // Reset after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
        setIsAddingToCart(false);
      }, 2000);
    } catch (error) {
      setIsAddingToCart(false);
      setToast({ message: 'Failed to add to cart. Please try again.', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold">Product not found.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary underline">Go Back</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pt-32 pb-20"
    >
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={closeToast}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="glass rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 aspect-square">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            <div className="flex space-x-3 md:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {(product.images || []).map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-zinc-700'}`} />
                  ))}
                </div>
                <span className="text-sm text-zinc-500 font-medium">({product.rating} / 5.0)</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">{product.name}</h1>
              <p className="text-2xl md:text-3xl font-bold text-primary">₹{product.price}</p>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="flex items-center bg-dark-700 rounded-full border border-white/5 px-2 py-1">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 md:p-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="px-4 md:px-6 text-lg font-bold w-12 md:w-16 text-center">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-2 md:p-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-zinc-500 text-sm font-medium">{product.stock} units available</span>
              </div>

              <div className="flex space-x-3 md:space-x-4 pt-4">
                {/* Add to Cart button with animated feedback */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  whileTap={!isAddingToCart ? { scale: 0.96 } : {}}
                  className={`flex-1 py-3.5 md:py-4 font-bold rounded-full transition-all flex items-center justify-center space-x-3 shadow-lg text-sm md:text-base ${
                    addedToCart
                      ? 'bg-emerald-500 shadow-emerald-500/30 text-white cursor-default'
                      : 'bg-primary hover:bg-primary-hover shadow-primary/30 text-white'
                  } disabled:opacity-70`}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-2"
                      >
                        <Check className="w-5 h-5" />
                        <span>Added to Cart</span>
                      </motion.span>
                    ) : isAddingToCart ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      />
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center space-x-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => product && toggleFavorite(product)}
                  className="p-3.5 md:p-4 border border-white/10 rounded-full hover:bg-white/5 transition-all group"
                  title={product && isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${product && isFavorite(product.id)
                        ? 'text-primary-coral fill-primary-coral'
                        : 'text-zinc-400 group-hover:text-primary-coral'
                      }`}
                  />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-white/5">
              {[
                { icon: Truck, label: 'Fast Delivery', sub: '2-4 Business Days', color: 'text-primary' },
                { icon: Shield, label: '2-Year Warranty', sub: 'Global Protection', color: 'text-emerald-500' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30-Day Policy', color: 'text-violet-500' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex flex-col items-center text-center space-y-1.5 md:space-y-2"
                >
                  <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.color}`} />
                  <span className="text-[9px] md:text-xs font-bold text-white uppercase tracking-tighter">{item.label}</span>
                  <span className="text-[8px] md:text-[10px] text-zinc-500">{item.sub}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
