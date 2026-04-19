import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Package, CheckCircle2 } from 'lucide-react';

export type PaymentMethod = 'razorpay' | 'cod';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const methods = [
  {
    id: 'razorpay' as PaymentMethod,
    name: 'Razorpay Secure',
    description: 'Credit/Debit Card, UPI, NetBanking',
    icon: null, // Will use image
    image: 'https://cdn.iconscout.com/icon/free/png-256/free-razorpay-1647037-1399775.png',
    accentColor: 'primary',
  },
  {
    id: 'cod' as PaymentMethod,
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Package,
    image: null,
    accentColor: 'primary-gold',
  },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const isSelected = selected === method.id;
        const Icon = method.icon;

        return (
          <motion.button
            key={method.id}
            onClick={() => onChange(method.id)}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 border ${
              isSelected
                ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Radio indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-primary' : 'border-zinc-600'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                    className="w-2.5 h-2.5 rounded-full bg-primary"
                  />
                )}
              </div>

              {/* Icon/Image */}
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {method.image ? (
                  <img src={method.image} className="w-6 h-6 object-contain" alt={method.name} />
                ) : (
                  Icon && <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-gold' : 'text-zinc-400'}`} />
                )}
              </div>

              {/* Text */}
              <div className="text-left">
                <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {method.name}
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">{method.description}</p>
              </div>
            </div>

            {/* Check icon when selected */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              >
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;
