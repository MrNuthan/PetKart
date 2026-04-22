import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-slate-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>New Spring Collection Out Now!</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Best Food & <span className="text-primary italic">Accessories</span> for Your Pets
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
              Give your furry, feathery, or finned friends the love they deserve with our premium curated collection of healthy treats, cozy beds, and interactive toys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onExplore}
                className="btn-primary flex items-center justify-center gap-2 group text-lg py-4"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-square relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-300">
              <img
                src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2060&auto=format&fit=crop"
                alt="Happy Dog"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floaties */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 md:-top-10 md:-right-10 z-20 bg-white p-4 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
                🦴
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Organic Treats</div>
                <div className="text-xs text-secondary font-medium">100% Nutritious</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 z-20 bg-white p-4 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                ⭐
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Premium Quality</div>
                <div className="text-xs text-accent font-medium">Vet Recommended</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
