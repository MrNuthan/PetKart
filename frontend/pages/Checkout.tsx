
import React, { useState } from 'react';
import { orderService } from '../services/orderService';
// Fix: Importing from 'react-router' to resolve 'no exported member' errors in this environment
import { useNavigate } from 'react-router';
import { CreditCard, Truck, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';

const Checkout: React.FC = () => {
  const { totalAmount, items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);



  // ... (inside component)

  const handlePayment = async () => {
    if (!address.address || !address.city || !address.postalCode) {
      alert("Please fill in all shipping details");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const orderData = await orderService.createOrder({
        address_line_1: address.address,
        city: address.city,
        postal_code: address.postalCode,
        first_name: address.firstName,
        last_name: address.lastName
      });

      // 2. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mock_key",
        amount: orderData.total_amount * 100, // Amount is expected in paise from backend ideally, but ensures match
        currency: "USD", // Or INR based on backend
        name: "PetKart",
        description: "Order #" + orderData.id,
        order_id: orderData.razorpay_order_id,
        handler: async function (response: any) {
          try {
            await orderService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            alert("Payment Successful!");
            clearCart();
            navigate('/profile');
          } catch (error) {
            alert("Payment Verification Failed");
            console.error(error);
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: user?.email || "",
        },
        theme: {
          color: "#06b6d4",
        },
      };

      const windowWithRazorpay = window as any;
      if (windowWithRazorpay.Razorpay) {
        const rzp1 = new windowWithRazorpay.Razorpay(options);
        rzp1.open();
      } else {
        alert("Razorpay SDK failed to load. Please check internet connection.");
      }

    } catch (error) {
      console.error("Order creation failed", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-extrabold text-white mb-10 tracking-tight">Finalize <span className="text-primary">Order</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Details */}
          <div className="space-y-8 animate-fade-in">
            <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-6">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">First Name</label>
                  <input
                    value={address.firstName}
                    onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Last Name</label>
                  <input
                    value={address.lastName}
                    onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Shipping Address</label>
                  <input
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">City</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Postal Code</label>
                  <input
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full bg-dark-700 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Truck className="w-6 h-6 text-zinc-400" />
                <div>
                  <h3 className="text-white font-bold">Priority Shipping</h3>
                  <p className="text-xs text-zinc-500">Delivered within 48-72 hours.</p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm uppercase">Free</span>
            </div>
          </div>

          {/* Checkout Totals */}
          <div className="space-y-8 animate-fade-in delay-100">
            <div className="glass p-8 rounded-[2rem] border border-white/10 space-y-6">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-razorpay-1647037-1399775.png" className="w-8 h-8 object-contain" alt="Razorpay" />
                    <span className="text-white font-bold">Razorpay Secure</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Total Items ({items.length})</span>
                  <span className="text-white font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-display font-extrabold text-white">Grand Total</span>
                  <span className="text-3xl font-display font-extrabold text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-all flex items-center justify-center group shadow-xl shadow-primary/30 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Pay Now with Razorpay</span>
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
