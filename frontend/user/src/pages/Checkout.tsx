import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, CreateOrderPayload } from '../services/orderService';
import { Address } from '../types';
import Toast, { ToastType } from '../components/Toast';
import OrderSuccessModal from '../components/OrderSuccessModal';
import PaymentMethodSelector, { PaymentMethod } from '../components/PaymentMethodSelector';

const Checkout: React.FC = () => {
  const { totalAmount, items, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // FIX #6: Pre-fill from user profile address stored in JSON
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    orderId: number | string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
  }>({ isOpen: false, orderId: '', paymentMethod: 'razorpay', totalAmount: 0 });

  // FIX #6: Update form when user profile loads
  useEffect(() => {
    setAddress(getSavedAddress());
  }, [user?.firstName, user?.lastName, user?.address]);

  // FIX #6: Auto-save shipping address to profile whenever address fields change
  const saveAddressToProfile = async (addr: Address) => {
    if (!user) return;
    try {
      await updateUser({
        firstName: addr.firstName,
        lastName: addr.lastName,
        address: JSON.stringify({
          address: addr.address,
          city: addr.city,
          postalCode: addr.postalCode,
        }),
      });
    } catch (err) {
      console.warn('Could not save address to profile:', err);
    }
  };

  const validate = (): boolean => {
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
      setToast({ message: 'Your cart is empty.', type: 'error' });
      return false;
    }
    return true;
  };

  const buildPayload = (): CreateOrderPayload => ({
    address_line_1: address.address,
    city: address.city,
    postal_code: address.postalCode,
    first_name: address.firstName,
    last_name: address.lastName,
    payment_method: paymentMethod,
  });

  const handleCod = async () => {
    if (!validate()) return;
    setIsProcessing(true);
    try {
      // FIX #6: Save address to profile before placing order
      await saveAddressToProfile(address);
      const order = await orderService.createOrder(buildPayload());
      await clearCart();
      setSuccessModal({
        isOpen: true,
        orderId: order.id,
        paymentMethod: 'cod',
        totalAmount: Number(order.total_amount),
      });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to place order. Please try again.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpay = async () => {
    if (!validate()) return;

    // FIX #1: Check Razorpay SDK is loaded before even trying
    const win = window as any;
    if (!win.Razorpay) {
      setToast({
        message:
          'Razorpay payment gateway is not available. Please check your internet connection or use Cash on Delivery.',
        type: 'error',
      });
      return;
    }

    setIsProcessing(true);
    try {
      // FIX #6: Save address to profile before placing order
      await saveAddressToProfile(address);
      const order = await orderService.createOrder(buildPayload());

      // FIX #1: Validate that backend returned a Razorpay order ID
      if (!order.razorpay_order_id) {
        // Backend didn't return razorpay_order_id — fall back to COD success or show error
        setToast({
          message:
            'Razorpay is not configured on the server. Your order was created — please contact support or try Cash on Delivery.',
          type: 'error',
        });
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        // Use the exact paise amount returned by the backend (computed with
        // Decimal arithmetic). Do NOT recalculate from total_amount here —
        // floating-point conversion (string → Number → * 100) introduces
        // precision errors that cause Razorpay to reject the payment.
        amount: order.razorpay_amount!,
        currency: 'INR',
        name: 'PetKart',
        description: `Order #${order.id}`,
        order_id: order.razorpay_order_id,
        handler: async (response: any) => {
          try {
            await orderService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            await clearCart();
            setSuccessModal({
              isOpen: true,
              orderId: order.id,
              paymentMethod: 'razorpay',
              totalAmount: Number(order.total_amount),
            });
          } catch (err: any) {
            setToast({
              message: err.message || 'Payment verification failed. Contact support.',
              type: 'error',
            });
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: user?.email || '',
        },
        theme: { color: '#16a34a' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setToast({ message: 'Payment was cancelled.', type: 'info' });
          },
        },
      };

      const rzp = new win.Razorpay(options);
      rzp.on('payment.failed', (r: any) => {
        setToast({
          message: r.error?.description || 'Payment failed. Please try again.',
          type: 'error',
        });
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to create order.', type: 'error' });
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'cod') handleCod();
    else handleRazorpay();
  };

  const inputCls =
    'w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white transition-all';
  const labelCls = 'text-[10px] font-bold text-slate-500 uppercase tracking-widest';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 py-10"
    >
      {toast && (
        <Toast message={toast.message} type={toast.type} isVisible={!!toast} onClose={closeToast} />
      )}
      <OrderSuccessModal
        isOpen={successModal.isOpen}
        orderId={successModal.orderId}
        paymentMethod={successModal.paymentMethod}
        totalAmount={successModal.totalAmount}
        onViewOrders={() => navigate('/profile')}
        onContinueShopping={() => navigate('/')}
      />

      <div className="container-custom max-w-5xl">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Shipping */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>First Name</label>
                  <input
                    className={inputCls}
                    value={address.firstName}
                    onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Last Name</label>
                  <input
                    className={inputCls}
                    value={address.lastName}
                    onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Street Address</label>
                <input
                  className={inputCls}
                  placeholder="House No., Street, Area"
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>City</label>
                  <input
                    className={inputCls}
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Postal Code</label>
                  <input
                    className={inputCls}
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-bold text-slate-700 text-sm">Priority Shipping</p>
                  <p className="text-xs text-slate-400">Delivered within 48–72 hours</p>
                </div>
              </div>
              <span className="font-black text-emerald-600 text-sm">FREE</span>
            </div>
          </div>

          {/* Right: Payment + Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Payment Method</h2>
              </div>

              <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />

              {/* Totals */}
              <div className="space-y-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Items ({items.reduce((a, i) => a + i.quantity, 0)})</span>
                  <span className="font-semibold text-slate-700">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-slate-500">
                    <span>COD Charges</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="font-black text-slate-900 text-base">Total</span>
                  <span className="font-black text-primary text-2xl">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Button */}
              <motion.button
                onClick={handlePayment}
                disabled={isProcessing}
                whileTap={!isProcessing ? { scale: 0.98 } : {}}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay with Razorpay'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">
                {paymentMethod === 'razorpay'
                  ? 'Secured by 256-bit SSL encryption'
                  : 'Pay safely at the time of delivery'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
