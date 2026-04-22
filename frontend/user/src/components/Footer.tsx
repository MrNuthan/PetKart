import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-6 w-fit group">
              <div className="bg-white rounded-3xl px-5 py-3 shadow-xl group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/petkart-logo - Footer.png"
                  alt="PetKart — Online Pet Store"
                  className="h-20 w-auto max-w-[240px] object-contain"
                />
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              India's premier online pet store. Premium food, accessories, and healthcare products for every pet — delivered to your door.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: '#', hover: 'hover:bg-pink-500' },
                { Icon: Twitter, href: '#', hover: 'hover:bg-sky-500' },
                { Icon: Facebook, href: '#', hover: 'hover:bg-blue-600' },
              ].map(({ Icon, href, hover }, i) => (
                <a
                  key={i}
                  href={href}
                  className={`w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center ${hover} transition-colors`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Support Links — only the real ones */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">
              Customer Support
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/faq', label: 'FAQs' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/refund-policy', label: 'Returns & Refund Policy' },
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-of-service', label: 'Terms of Service' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-slate-400 hover:text-white transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">
              Get In Touch
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Bangalore, Karnataka, India — 560001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:support@petkart.in" className="hover:text-white transition-colors">
                  support@petkart.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs font-semibold tracking-widest uppercase">
          <p>© {new Date().getFullYear()} PetKart. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/refund-policy" className="hover:text-slate-300 transition-colors">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
