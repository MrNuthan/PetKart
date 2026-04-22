import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, CheckCircle2 } from 'lucide-react';
import { orderService } from '../services/orderService';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  productName: string;
  orderId: number;
}

const RATING_LABELS = ['', 'Terrible 😞', 'Not Good 😕', 'Okay 😐', 'Good 😊', 'Excellent! 🌟'];

const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  productName,
  orderId,
}) => {
  const [rating, setRating]       = useState(0);
  const [hovered, setHovered]     = useState(0);
  const [comment, setComment]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const resetState = () => {
    setRating(0); setHovered(0); setComment('');
    setError(null); setSuccess(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a star rating before submitting.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await orderService.submitReview({
        product_id: productId,
        order_id: orderId,
        rating,
        comment,
      });
      setSuccess(true);
      // Brief success flash, then close and notify parent
      setTimeout(() => {
        resetState();
        onSuccess();
      }, 1600);
    } catch (err: any) {
      setError(err.message || 'Failed to submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-10"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            {success ? (
              /* Success State */
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <div>
                  <p className="font-black text-slate-900 text-xl mb-1">Review Submitted!</p>
                  <p className="text-slate-400 text-sm">Thanks for sharing your feedback.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6 pr-8">
                  <h3 className="text-xl font-black text-slate-900">Write a Review</h3>
                  <p className="text-sm text-slate-400 mt-0.5 truncate">{productName}</p>
                </div>

                {/* Star Rating */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Your Rating <span className="text-red-400">*</span>
                  </p>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => { setRating(star); setError(null); }}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`w-10 h-10 transition-colors duration-150 ${
                            star <= (hovered || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {(hovered || rating) > 0 && (
                    <motion.p
                      key={hovered || rating}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-amber-500 mt-1.5"
                    >
                      {RATING_LABELS[hovered || rating]}
                    </motion.p>
                  )}
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Your Review <span className="text-slate-300">(Optional)</span>
                  </p>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share what you loved, or what could be better..."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white transition-all placeholder:text-slate-300"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-sm font-medium mb-4 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WriteReviewModal;
