import React from 'react';
import { CreditCard, Truck } from 'lucide-react';
import { cn } from '../lib/utils';

export type PaymentMethod = 'razorpay' | 'cod';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const METHODS = [
  {
    id: 'razorpay' as PaymentMethod,
    label: 'Pay Online',
    sub: 'Razorpay — Cards, UPI, Wallets',
    icon: CreditCard,
    color: 'text-primary',
    bg: 'bg-primary/5 border-primary/20',
  },
  {
    id: 'cod' as PaymentMethod,
    label: 'Cash on Delivery',
    sub: 'Pay securely at your doorstep',
    icon: Truck,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
  },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-3">
      {METHODS.map((method) => {
        const isSelected = selected === method.id;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
              isSelected ? method.bg : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            )}
          >
            {/* Radio dot */}
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                isSelected ? 'border-primary' : 'border-slate-300'
              )}
            >
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>

            {/* Icon */}
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                isSelected ? method.bg : 'bg-slate-100'
              )}
            >
              <method.icon className={cn('w-5 h-5', isSelected ? method.color : 'text-slate-400')} />
            </div>

            {/* Text */}
            <div>
              <p className={cn('font-bold text-sm', isSelected ? 'text-slate-900' : 'text-slate-600')}>
                {method.label}
              </p>
              <p className="text-xs text-slate-400">{method.sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;
