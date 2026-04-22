import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ChevronLeft, ShoppingCart
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, totalAmount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-400 text-sm mb-8">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
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
      className="min-h-screen bg-slate-50 py-10"
    >
      <div className="container-custom">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors mb-8 text-sm font-semibold group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8">
          Shopping <span className="text-primary">Cart</span>
          <span className="ml-3 text-lg font-semibold text-slate-400">({items.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, height: 0 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-5 shadow-sm"
                >
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&q=80';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm truncate">{item.name}</h3>
                    <p className="text-base font-black text-slate-900 mt-1">₹{item.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Quantity */}
                    <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-black text-slate-900 text-sm min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Total for item */}
                    <span className="text-sm font-black text-primary">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-24 space-y-5">
              <h2 className="text-lg font-black text-slate-900">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-slate-700">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-black text-slate-900 text-base">Total</span>
                  <span className="font-black text-primary text-xl">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">
                Secure 256-bit SSL encrypted checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
