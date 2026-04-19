import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: number | string;
  paymentMethod: 'razorpay' | 'cod';
  totalAmount: number;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderId,
  paymentMethod,
  totalAmount,
  onViewOrders,
  onContinueShopping,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onContinueShopping}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative glass rounded-[2rem] border border-white/10 p-8 md:p-12 max-w-md w-full text-center shadow-2xl"
          >
            {/* Success animation circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
              className="relative mx-auto mb-6"
            >
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400/20 to-primary/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.4 }}
                >
                  <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-display font-extrabold text-white mb-2"
            >
              Order Placed! 🎉
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-400 text-sm mb-6"
            >
              Your order has been successfully placed and is being processed.
            </motion.p>

            {/* Order details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 rounded-2xl p-5 mb-8 space-y-3 border border-white/5"
            >
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Order ID</span>
                <span className="text-white font-bold">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Payment</span>
                <span className="text-white font-bold flex items-center gap-2">
                  {paymentMethod === 'cod' ? (
                    <>
                      <Package className="w-4 h-4 text-primary-gold" />
                      Cash on Delivery
                    </>
                  ) : (
                    <>
                      <img src="https://cdn.iconscout.com/icon/free/png-256/free-razorpay-1647037-1399775.png" className="w-4 h-4 object-contain" alt="" />
                      Razorpay
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Total</span>
                <span className="text-xl font-display font-extrabold text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={onViewOrders}
                className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all flex items-center justify-center group shadow-lg shadow-primary/20 text-sm"
              >
                View My Orders
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onContinueShopping}
                className="flex-1 py-3.5 border border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center text-sm"
              >
                <ShoppingBag className="mr-2 w-4 h-4" />
                Continue Shopping
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessModal;
