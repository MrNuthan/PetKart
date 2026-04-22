import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Plus, Minus, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MOCK_PRODUCTS } from '../data';

interface ProductDetailsProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full max-h-[90vh] lg:h-auto"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left: Product Image */}
          <div className="lg:w-1/2 p-6 flex flex-col gap-6">
            <div className="flex-1 min-h-[300px] lg:min-h-[500px] rounded-[2.5rem] overflow-hidden group shadow-lg">
               <img
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
               />
            </div>
            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-primary transition-all shrink-0 shadow-sm"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2 p-8 lg:p-12 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                {product.category}
              </span>
              {product.tags?.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1.5 text-accent">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg font-bold text-slate-900">{product.rating}</span>
                <span className="text-sm font-medium text-slate-400">({product.reviews} Reviews)</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="text-sm font-bold text-secondary">In Stock ({product.stock})</div>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <div className="text-4xl font-black text-slate-900">
                ${product.price.toFixed(2)}
              </div>
              {product.originalPrice && (
                <div className="text-xl text-slate-400 line-through font-medium">
                  ${product.originalPrice.toFixed(2)}
                </div>
              )}
              {product.originalPrice && (
                <div className="bg-secondary text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                  Save {Math.round((1 - product.price/product.originalPrice) * 100)}%
                </div>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed mb-10 text-lg">
              {product.description}
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-white/50 transition-colors shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-white/50 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => onAddToCart(product, quantity)}
                  className="btn-primary w-full sm:flex-1 py-4 flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>

                <button className="w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
              
              <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                Buy It Now
              </button>
            </div>

            {/* Extra Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                   <ShieldCheck className="w-5 h-5" />
                 </div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quality Assurance</div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                   <Truck className="w-5 h-5" />
                 </div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast Delivery</div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                   <RotateCcw className="w-5 h-5" />
                 </div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">7 Days Return</div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Related Products Section (Desktop and Mobile) */}
        {product && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="hidden xl:flex flex-col gap-6 w-80 ml-8"
          >
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-50 flex flex-col h-full overflow-hidden">
               <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-secondary" />
                 More for you
               </h4>
               <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                 {/* Logic to show related products from MOCK_PRODUCTS */}
                 {MOCK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3).map(related => (
                   <div key={related.id} className="flex gap-4 group cursor-pointer" onClick={() => {/* Handle click if needed */}}>
                     <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                       <img src={related.image} alt={related.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     </div>
                     <div className="flex flex-col justify-center">
                       <h5 className="text-sm font-bold text-slate-800 line-clamp-1">{related.name}</h5>
                       <span className="text-primary font-black text-lg">${related.price.toFixed(2)}</span>
                     </div>
                   </div>
                 ))}
               </div>
               <button className="mt-8 text-primary font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2">
                 See All {product.category}
                 <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
