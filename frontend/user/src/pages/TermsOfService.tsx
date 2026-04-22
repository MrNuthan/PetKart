import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3 pt-8">
    <h2 className="text-lg font-black text-slate-900">{title}</h2>
    <div className="text-slate-500 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const TermsOfService: React.FC = () => (
  <div className="min-h-screen bg-white py-16">
    <div className="container-custom max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-4 bg-primary/10 px-4 py-2 rounded-full">
            <ScrollText className="w-3.5 h-3.5" /> Legal
          </span>
          <h1 className="text-4xl font-black text-slate-900 mt-4 mb-2">Terms of Service</h1>
          <p className="text-slate-400 text-sm">Last updated: April 20, 2025</p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm text-amber-700">
          By using PetKart, you agree to these terms. Please read them carefully before using our services.
        </div>

        <div className="divide-y divide-slate-100">
          <Section title="1. Acceptance of Terms">
            <p>By accessing or using PetKart, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
          </Section>
          <Section title="2. Use of the Platform">
            <p>You must be at least 18 years old to create an account. You agree to provide accurate information and are responsible for maintaining the security of your account.</p>
            <p>You may not use PetKart for any unlawful purposes or in violation of these terms.</p>
          </Section>
          <Section title="3. Product Listings">
            <p>We strive to ensure product descriptions and prices are accurate. In case of errors, we reserve the right to cancel orders at incorrect prices.</p>
          </Section>
          <Section title="4. Payments">
            <p>Payments are processed securely. By placing an order, you authorize us to charge the total amount shown at checkout.</p>
          </Section>
          <Section title="5. Intellectual Property">
            <p>All content on PetKart (images, logos, text) is owned by PetKart or its licensors. You may not reproduce or distribute any content without permission.</p>
          </Section>
          <Section title="6. Limitation of Liability">
            <p>PetKart is not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
          </Section>
          <Section title="7. Contact">
            <p>Questions? <a href="mailto:legal@petkart.in" className="text-primary font-semibold hover:underline">legal@petkart.in</a></p>
          </Section>
        </div>
      </motion.div>
    </div>
  </div>
);

export default TermsOfService;
