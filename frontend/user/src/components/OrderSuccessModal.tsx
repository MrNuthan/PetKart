import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, ShoppingBag, IndianRupee } from 'lucide-react';

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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 text-center border border-slate-100">
              {/* Success Icon */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                <div className="relative w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-1">Order Placed!</h2>
              <p className="text-slate-500 text-sm mb-6">
                {paymentMethod === 'cod'
                  ? 'Your order is confirmed. Pay at the time of delivery.'
                  : 'Payment successful! Your order is confirmed.'}
              </p>

              {/* Order Details */}
              <div className="bg-slate-50 rounded-2xl p-5 mb-6 space-y-3 text-left border border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Package className="w-4 h-4" />
                    Order ID
                  </div>
                  <span className="font-bold text-slate-900">#{orderId}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <IndianRupee className="w-4 h-4" />
                    Total
                  </div>
                  <span className="font-black text-primary text-base">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <ShoppingBag className="w-4 h-4" />
                    Payment
                  </div>
                  <span className="font-bold text-slate-700">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onViewOrders}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all text-sm shadow-lg shadow-primary/20"
                >
                  View My Orders
                </button>
                <button
                  onClick={onContinueShopping}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessModal;
