import React from 'react';
import { Link } from 'react-router';
import { Github, Twitter, Instagram, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <img
              src="/pet_logo.png"
              alt="PetKart"
              className="h-20 w-auto filter brightness-110 mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/StackBlitz/stackblitz-images/main/petkart-logo.png';
              }}
            />
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              PetKart: Elevating the lives of pets through premium nutrition, luxury comfort, and modern wellness essentials. Because your pets deserve the very best.
            </p>
            <div className="flex space-x-5">
              <Instagram className="w-5 h-5 text-zinc-500 hover:text-primary transition-colors cursor-pointer" />
              <Twitter className="w-5 h-5 text-zinc-500 hover:text-primary transition-colors cursor-pointer" />
              <Github className="w-5 h-5 text-zinc-500 hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Explore</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-primary transition-colors">Shop All</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Categories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Join the Community</h4>
            <p className="text-zinc-500 text-sm mb-6">
              Subscribe for exclusive tips, member drops, and pet wellness insights.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-dark-800 border border-white/10 rounded-full py-3 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 pr-12 text-white"
              />
              <button className="absolute right-1 top-1 p-2 bg-primary rounded-full hover:bg-primary-hover transition-colors shadow-lg">
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 mt-3 uppercase tracking-widest">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          <p>© 2025 PetKart. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link to="/privacy-policy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-zinc-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;