import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }, 4000);
  };

  const inputCls =
    'w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white transition-all';

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container-custom max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-4 bg-primary/10 px-4 py-2 rounded-full">
              <MessageCircle className="w-3.5 h-3.5" /> Get in Touch
            </span>
            <h1 className="text-4xl font-black text-slate-900 mb-4">Contact Our Team</h1>
            <p className="text-slate-500 max-w-md mx-auto">We're here to help! Reach out to us regarding orders, products, or anything else.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Info */}
            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'support@petkart.in', sub: 'Replies within 24 hours' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon–Sat, 9 AM – 6 PM' },
                { icon: MapPin, label: 'Office', value: 'Bangalore, Karnataka', sub: 'India — 560001' },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                    <p className="font-bold text-slate-900 text-sm">{value}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center gap-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                  <h3 className="text-xl font-black text-slate-900">Message Sent!</h3>
                  <p className="text-slate-400 text-sm">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Name</label>
                    <input className={inputCls} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Email</label>
                    <input type="email" className={inputCls} required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Message</label>
                    <textarea className={inputCls + ' resize-none min-h-[120px]'} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
