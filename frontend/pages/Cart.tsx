
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, totalAmount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-20 max-w-7xl mx-auto px-4 text-center"
      >
        <div className="glass max-w-md mx-auto p-8 md:p-12 rounded-[2rem] border border-white/5">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-zinc-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-zinc-500 text-sm mb-8">Looks like you haven't added anything to your collection yet.</p>
          <Link to="/" className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-all text-sm md:text-base">
            Start Shopping
          </Link>
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
        <button onClick={() => navigate(-1)} className="flex items-center text-zinc-500 hover:text-white transition-colors mb-6 md:mb-8 group text-sm">
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to browsing
        </button>

        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-8 md:mb-10 tracking-tight">Shopping <span className="text-primary">Bag</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="glass p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 flex flex-row items-center space-x-4 md:space-x-6"
                >
                  <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] md:text-[10px] text-primary uppercase font-bold tracking-widest">{item.category}</span>
                    <h3 className="text-sm md:text-xl font-bold text-white mb-0.5 md:mb-1 truncate">{item.name}</h3>
                    <p className="hidden sm:block text-zinc-500 text-xs md:text-sm line-clamp-1 mb-2">{item.description}</p>
                    <p className="text-sm md:text-xl font-bold text-white">₹{item.price}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-2 md:space-y-4">
                    <div className="flex items-center bg-dark-800 rounded-lg md:rounded-xl border border-white/5 px-1 md:px-2 py-0.5 md:py-1">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 md:p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3 md:w-4 md:h-4" />
                      </motion.button>
                      <span className="px-2 md:px-4 font-bold text-white text-xs md:text-base w-6 md:w-10 text-center">{item.quantity}</span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 md:p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center text-[8px] md:text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-widest"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/10 sticky top-28 space-y-6"
            >
              <h2 className="text-lg md:text-xl font-display font-bold text-white">Order Summary</h2>

              <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-semibold">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Tax</span>
                  <span className="text-white font-semibold">₹0.00</span>
                </div>
                <div className="border-t border-white/5 pt-3 md:pt-4 flex justify-between">
                  <span className="text-base md:text-lg font-bold text-white">Total</span>
                  <span className="text-xl md:text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl md:rounded-2xl p-3 md:p-4">
                <p className="text-[8px] md:text-[10px] text-primary uppercase font-bold tracking-widest mb-1">Promo Code</p>
                <div className="flex space-x-2">
                  <input type="text" placeholder="Enter code" className="flex-1 bg-dark-800 border-none rounded-lg py-1.5 md:py-2 px-3 text-xs md:text-sm focus:ring-1 focus:ring-primary/50" />
                  <button className="px-3 md:px-4 py-1.5 md:py-2 bg-zinc-800 rounded-lg text-[10px] md:text-xs font-bold hover:bg-zinc-700 transition-colors">Apply</button>
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Link
                  to="/checkout"
                  className="w-full py-3 md:py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl md:rounded-2xl transition-all flex items-center justify-center group shadow-lg shadow-primary/20 text-sm md:text-base"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <p className="text-[8px] md:text-[10px] text-zinc-600 text-center uppercase tracking-widest leading-relaxed">
                Secure 256-bit SSL encrypted payment processing.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
