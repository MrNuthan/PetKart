import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 2–5 business days. We also offer express delivery at ₹99 for next-day delivery in major cities.',
  },
  {
    q: 'Can I return a product?',
    a: 'Yes! We offer a 30-day hassle-free return policy for all products. Items must be unused and in original packaging.',
  },
  {
    q: 'Is Cash on Delivery available?',
    a: 'Yes, COD is available for orders up to ₹5,000. Simply select "Cash on Delivery" at checkout.',
  },
  {
    q: 'How do I track my order?',
    a: 'After placing an order, go to My Profile → My Orders to see your order status and tracking details.',
  },
  {
    q: 'Are the products safe for pets?',
    a: 'All our products are carefully curated and vet-approved. We only stock items that meet our strict safety standards.',
  },
  {
    q: 'Do you ship to all cities in India?',
    a: 'We ship across India to 500+ cities. Enter your pincode at checkout to check delivery availability.',
  },
  {
    q: 'How do I change or cancel my order?',
    a: 'Contact us within 2 hours of placing the order at support@petkart.in to cancel or make changes.',
  },
  {
    q: 'Are there any membership plans?',
    a: 'We currently offer a loyalty rewards program where every purchase earns you PetPoints, redeemable on future orders.',
  },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container-custom max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-4 bg-primary/10 px-4 py-2 rounded-full">
              <HelpCircle className="w-3.5 h-3.5" /> FAQs
            </span>
            <h1 className="text-4xl font-black text-slate-900 mb-3">Frequently Asked Questions</h1>
            <p className="text-slate-500">Find quick answers to common questions about PetKart.</p>
          </div>

          <div className="space-y-3">
            {FAQ_DATA.map((item, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-sm pr-4">{item.q}</span>
                  {open === i ? (
                    <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-slate-50 pt-4">
                        <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
