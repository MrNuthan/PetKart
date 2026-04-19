
import React, { useState, useCallback } from 'react';
import { orderService, CreateOrderPayload } from '../services/orderService';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Truck, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';
import Toast, { ToastType } from '../components/Toast';
import OrderSuccessModal from '../components/OrderSuccessModal';
import PaymentMethodSelector, { PaymentMethod } from '../components/PaymentMethodSelector';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Checkout: React.FC = () => {
  const { totalAmount, items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Parse saved address from user profile (stored as JSON)
  const getSavedAddress = (): Address => {
    const base: Address = {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      address: '',
      city: '',
      postalCode: '',
    };
    if (user?.address) {
      try {
        const parsed = JSON.parse(user.address);
        return {
          ...base,
          address: parsed.address || '',
          city: parsed.city || '',
          postalCode: parsed.postalCode || '',
        };
      } catch {
        return { ...base, address: user.address };
      }
    }
    return base;
  };

  const [address, setAddress] = useState<Address>(getSavedAddress());
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  // Success modal state
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    orderId: number | string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
  }>({ isOpen: false, orderId: '', paymentMethod: 'razorpay', totalAmount: 0 });

  const validateForm = (): boolean => {
    if (!address.firstName.trim()) {
      setToast({ message: 'Please enter your first name.', type: 'error' });
      return false;
    }
    if (!address.lastName.trim()) {
      setToast({ message: 'Please enter your last name.', type: 'error' });
      return false;
    }
    if (!address.address.trim()) {
      setToast({ message: 'Please enter your shipping address.', type: 'error' });
      return false;
    }
    if (!address.city.trim()) {
      setToast({ message: 'Please enter your city.', type: 'error' });
      return false;
    }
    if (!address.postalCode.trim()) {
      setToast({ message: 'Please enter your postal code.', type: 'error' });
      return false;
    }
    if (items.length === 0) {
      setToast({ message: 'Your cart is empty. Add items before checkout.', type: 'error' });
      return false;
    }
    return true;
  };

  const buildOrderPayload = (): CreateOrderPayload => ({
    address_line_1: address.address,
    city: address.city,
    postal_code: address.postalCode,
    first_name: address.firstName,
    last_name: address.lastName,
    payment_method: paymentMethod,
  });

  const handleCodPayment = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      const orderData = await orderService.createOrder(buildOrderPayload());
      clearCart();
      setSuccessModal({
        isOpen: true,
        orderId: orderData.id,
        paymentMethod: 'cod',
        totalAmount: Number(orderData.total_amount),
      });
    } catch (error: any) {
      console.error('COD order creation failed:', error);
      setToast({ message: error.message || 'Failed to place order. Please try again.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const orderData = await orderService.createOrder(buildOrderPayload());

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
        amount: Number(orderData.total_amount) * 100, // Razorpay expects paise
        currency: 'INR',
        name: 'PetKart',
        description: `Order #${orderData.id}`,
        order_id: orderData.razorpay_order_id,
        handler: async function (response: any) {
          try {
            await orderService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            setSuccessModal({
              isOpen: true,
              orderId: orderData.id,
              paymentMethod: 'razorpay',
              totalAmount: Number(orderData.total_amount),
            });
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            setToast({ message: error.message || 'Payment verification failed. Contact support.', type: 'error' });
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: user?.email || '',
        },
        theme: {
          color: '#00d2ff',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setToast({ message: 'Payment was cancelled.', type: 'info' });
          },
        },
      };

      const windowWithRazorpay = window as any;
      if (windowWithRazorpay.Razorpay) {
        const rzp1 = new windowWithRazorpay.Razorpay(options);
        rzp1.on('payment.failed', (response: any) => {
          console.error('Razorpay payment failed:', response.error);
          setToast({
            message: response.error?.description || 'Payment failed. Please try again.',
            type: 'error',
          });
          setIsProcessing(false);
        });
        rzp1.open();
      } else {
        setToast({ message: 'Razorpay SDK failed to load. Check your internet connection.', type: 'error' });
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Order creation failed:', error);
      setToast({ message: error.message || 'Failed to create order. Please try again.', type: 'error' });
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'cod') {
      handleCodPayment();
    } else {
      handleRazorpayPayment();
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="pt-28 md:pt-32 pb-20"
    >
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={closeToast}
        />
      )}

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={successModal.isOpen}
        orderId={successModal.orderId}
        paymentMethod={successModal.paymentMethod}
        totalAmount={successModal.totalAmount}
        onViewOrders={() => navigate('/profile')}
        onContinueShopping={() => navigate('/')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          variants={fadeUp}
          className="text-3xl md:text-4xl font-display font-extrabold text-white mb-8 md:mb-10 tracking-tight"
        >
          Finalize <span className="text-primary">Order</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Shipping Details */}
          <div className="space-y-6 md:space-y-8">
            <motion.div variants={fadeUp} className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 space-y-5 md:space-y-6">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">First Name</label>
                  <input
                    value={address.firstName}
                    onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Last Name</label>
                  <input
                    value={address.lastName}
                    onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Shipping Address</label>
                  <input
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="House No, Street, Area"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">City</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Postal Code</label>
                  <input
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="glass p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Truck className="w-5 h-5 md:w-6 md:h-6 text-zinc-400" />
                <div>
                  <h3 className="text-white font-bold text-sm md:text-base">Priority Shipping</h3>
                  <p className="text-[10px] md:text-xs text-zinc-500">Delivered within 48-72 hours.</p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-xs md:text-sm uppercase">Free</span>
            </motion.div>
          </div>

          {/* Payment & Totals */}
          <div className="space-y-6 md:space-y-8">
            <motion.div variants={fadeUp} className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 space-y-6">
              {/* Payment Method Selector */}
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Payment Method</h2>
                </div>
                <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
              </div>

              {/* Order Totals */}
              <div className="space-y-3 md:space-y-4 border-t border-white/5 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-sm">Total Items ({items.length})</span>
                  <span className="text-white font-bold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-sm">Shipping</span>
                  <span className="text-emerald-400 font-bold text-sm">FREE</span>
                </div>
                {paymentMethod === 'cod' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-zinc-500 text-sm">COD Charges</span>
                    <span className="text-emerald-400 font-bold text-sm">FREE</span>
                  </motion.div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg md:text-xl font-display font-extrabold text-white">Grand Total</span>
                  <span className="text-2xl md:text-3xl font-display font-extrabold text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Button */}
              <motion.button
                onClick={handlePayment}
                disabled={isProcessing}
                whileTap={!isProcessing ? { scale: 0.98 } : {}}
                className="w-full py-4 md:py-5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl md:rounded-2xl transition-all flex items-center justify-center group shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' : 'Pay Now with Razorpay'}
                    </span>
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>

              {/* Security Note */}
              <p className="text-[8px] md:text-[10px] text-zinc-600 text-center uppercase tracking-widest leading-relaxed">
                {paymentMethod === 'razorpay'
                  ? 'Secure 256-bit SSL encrypted payment via Razorpay.'
                  : 'Your order will be confirmed. Pay securely at the time of delivery.'
                }
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
