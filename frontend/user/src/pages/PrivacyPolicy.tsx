import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="text-lg font-black text-slate-900">{title}</h2>
    <div className="text-slate-500 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container-custom max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-4 bg-primary/10 px-4 py-2 rounded-full">
              <Shield className="w-3.5 h-3.5" /> Privacy Policy
            </span>
            <h1 className="text-4xl font-black text-slate-900 mt-4 mb-2">Privacy Policy</h1>
            <p className="text-slate-400 text-sm">Last updated: April 20, 2025</p>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-sm text-slate-600">
            At PetKart, we respect your privacy and are committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights.
          </div>

          <div className="space-y-8 divide-y divide-slate-100">
            <Section title="1. Information We Collect">
              <p>We collect information you provide during registration (name, email, password), during purchases (shipping address, payment info), and automatically (device, IP address, browsing behavior on our platform).</p>
            </Section>
            <div className="pt-8">
              <Section title="2. How We Use Your Information">
                <p>To process orders and send confirmations and delivery updates.</p>
                <p>To personalize your shopping experience and recommend products.</p>
                <p>To communicate offers, promotions, and updates (you can opt out anytime).</p>
                <p>To improve our platform, resolve technical issues, and ensure security.</p>
              </Section>
            </div>
            <div className="pt-8">
              <Section title="3. Data Sharing">
                <p>We do not sell your personal data. We share it only with trusted partners who assist us in running our business (payment processors, delivery partners) under strict confidentiality agreements.</p>
              </Section>
            </div>
            <div className="pt-8">
              <Section title="4. Cookies">
                <p>We use cookies to keep you logged in, remember cart items, and analyze traffic. You can disable cookies in your browser settings, though some features may not work correctly.</p>
              </Section>
            </div>
            <div className="pt-8">
              <Section title="5. Your Rights">
                <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@petkart.in to exercise these rights.</p>
              </Section>
            </div>
            <div className="pt-8">
              <Section title="6. Contact Us">
                <p>For privacy-related queries, contact us at: <a href="mailto:privacy@petkart.in" className="text-primary font-semibold hover:underline">privacy@petkart.in</a></p>
              </Section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
