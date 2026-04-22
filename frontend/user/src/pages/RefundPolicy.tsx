import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3 pt-8">
    <h2 className="text-lg font-black text-slate-900">{title}</h2>
    <div className="text-slate-500 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const RefundPolicy: React.FC = () => (
  <div className="min-h-screen bg-white py-16">
    <div className="container-custom max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-4 bg-primary/10 px-4 py-2 rounded-full">
            <RefreshCw className="w-3.5 h-3.5" /> Returns
          </span>
          <h1 className="text-4xl font-black text-slate-900 mt-4 mb-2">Refund & Return Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: April 20, 2025</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-sm text-emerald-700">
          We offer a <strong>30-day hassle-free return policy</strong> on most items. Your satisfaction is our priority.
        </div>

        <div className="divide-y divide-slate-100">
          <Section title="1. Eligibility for Returns">
            <p>Items must be returned within 30 days of delivery. Products must be unused, in original packaging, and with all accessories intact.</p>
            <p>The following categories are non-returnable: opened food/treats, hygiene products, and customized items.</p>
          </Section>
          <Section title="2. How to Initiate a Return">
            <p>Email us at <a href="mailto:returns@petkart.in" className="text-primary font-semibold hover:underline">returns@petkart.in</a> with your order ID and reason for return.</p>
            <p>Our team will respond within 24 hours with further instructions.</p>
          </Section>
          <Section title="3. Refund Process">
            <p>Once we receive and inspect the returned item, we will process the refund within 5–7 business days.</p>
            <p>Refunds are credited to the original payment method (UPI, bank account, or credit/debit card).</p>
            <p>COD orders will receive a bank transfer to a provided account number.</p>
          </Section>
          <Section title="4. Shipping Costs for Returns">
            <p>If the return is due to a defect or wrong item, we cover the return shipping costs.</p>
            <p>For other reasons, the customer bears the return shipping cost.</p>
          </Section>
          <Section title="5. Damaged or Wrong Items">
            <p>If you received a damaged or incorrect item, please contact us within 48 hours of delivery with photos. We'll arrange a replacement or full refund immediately.</p>
          </Section>
          <Section title="6. Contact">
            <p>Questions? <a href="mailto:returns@petkart.in" className="text-primary font-semibold hover:underline">returns@petkart.in</a></p>
          </Section>
        </div>
      </motion.div>
    </div>
  </div>
);

export default RefundPolicy;
