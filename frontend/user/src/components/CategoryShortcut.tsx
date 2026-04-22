import React from 'react';
import { PetCategory } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CategoryShortcutProps {
  onCategorySelect: (category: PetCategory) => void;
  activeCategory: PetCategory;
}

const CATEGORIES = [
  { name: 'Dog', icon: '🐶', image: 'https://images.unsplash.com/photo-1543466835-00a731f360f1?w=400&q=80' },
  { name: 'Cat', icon: '🐱', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80' },
  { name: 'Bird', icon: '🐦', image: 'https://images.unsplash.com/photo-1552084117-56a987666449?w=400&q=80' },
  { name: 'Fish', icon: '🐠', image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&q=80' },
];

export const CategoryShortcut: React.FC<CategoryShortcutProps> = ({ onCategorySelect, activeCategory }) => {
  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Shop by Pet Type</h2>
          <p className="text-slate-500 font-medium">Find specifically curated products dedicated to your favorite animal buddies.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.name}
              whileHover={{ y: -10 }}
              onClick={() => {
                onCategorySelect(cat.name as PetCategory);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] aspect-square shadow-xl transition-all duration-500",
                activeCategory === cat.name ? "ring-4 ring-primary ring-offset-4" : ""
              )}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">{cat.icon}</span>
                <span className="text-xl font-black text-white uppercase tracking-widest">{cat.name}s</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
