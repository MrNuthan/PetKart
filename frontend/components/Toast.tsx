import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgClass: 'bg-emerald-500/10 border-emerald-500/30',
    iconClass: 'text-emerald-400',
    barClass: 'bg-emerald-400',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-500/10 border-red-500/30',
    iconClass: 'text-red-400',
    barClass: 'bg-red-400',
  },
  info: {
    icon: Info,
    bgClass: 'bg-primary/10 border-primary/30',
    iconClass: 'text-primary',
    barClass: 'bg-primary',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose, duration = 4000 }) => {
  const [progress, setProgress] = useState(100);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (!isVisible) return;

    setProgress(100);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -30, x: '-50%', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed top-6 left-1/2 z-[100] min-w-[320px] max-w-[90vw] rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${config.bgClass}`}
        >
          <div className="flex items-center gap-3 px-5 py-4">
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconClass}`} />
            <p className="text-sm font-medium text-white flex-1">{message}</p>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-[2px] bg-white/5">
            <motion.div
              className={`h-full ${config.barClass}`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
