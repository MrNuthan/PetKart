import React from 'react';
import {
  CheckCircle2, Package, Truck, MapPin, ShoppingBag, XCircle, PackageCheck,
} from 'lucide-react';
import { OrderStatus } from '../types';

interface Step {
  status: OrderStatus;
  label: string;
  shortLabel: string;
  Icon: React.ElementType;
}

const STEPS: Step[] = [
  { status: 'Placed',           label: 'Order Placed',     shortLabel: 'Placed',    Icon: ShoppingBag   },
  { status: 'Packed',           label: 'Packed',           shortLabel: 'Packed',    Icon: Package       },
  { status: 'Shipped',          label: 'Shipped',          shortLabel: 'Shipped',   Icon: Truck         },
  { status: 'Out for Delivery', label: 'Out for Delivery', shortLabel: 'On the Way',Icon: MapPin        },
  { status: 'Delivered',        label: 'Delivered',        shortLabel: 'Delivered', Icon: PackageCheck  },
];

interface OrderTrackerProps {
  status: OrderStatus;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ status }) => {
  // Cancelled orders get a special banner
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 rounded-2xl border border-red-100">
        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
        <span className="text-sm font-bold text-red-500">This order has been cancelled.</span>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.status === status);

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-start min-w-[480px] px-1 py-2">
        {STEPS.map((step, idx) => {
          const isDone    = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <React.Fragment key={step.status}>
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : isCurrent
                      ? 'bg-white text-primary ring-2 ring-primary ring-offset-1 shadow-md shadow-primary/20'
                      : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <step.Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold text-center leading-tight w-14 ${
                    isDone || isCurrent ? 'text-primary' : 'text-slate-300'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>

              {/* Connector Line */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 flex items-start pt-[18px] mx-0.5">
                  <div
                    className={`h-0.5 w-full rounded-full transition-all duration-500 ${
                      isDone ? 'bg-primary' : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
