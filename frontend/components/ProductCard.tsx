import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, ShieldCheck, Leaf, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdded) return;
    setIsAdded(true);
    await addToCart(product);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const getBadge = () => {
    if (product.category === 'Food') return { text: 'Grain-Free', icon: Leaf, color: 'text-emerald-400' };
    if (product.category === 'Health') return { text: 'Vet Approved', icon: ShieldCheck, color: 'text-indigo-400' };
    if (product.featured) return { text: 'Top Seller', icon: Star, color: 'text-yellow-400' };
    return null;
  };

  const badge = getBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="group bg-zinc-900 rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full w-full"
    >
      {/* Image Section */}
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-[5/4] overflow-hidden bg-zinc-800"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {badge && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shadow">
            <badge.icon className={`w-3 h-3 ${badge.color}`} />
            <span className="text-white">{badge.text}</span>
          </div>
        )}

        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.92 }}
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wide flex items-center gap-1 ${
            isAdded
              ? 'bg-emerald-500 hover:bg-emerald-500'
              : 'bg-primary hover:bg-primary-hover'
          }`}
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                ADDED!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                ADD TO CART
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </Link>

      {/* Content */}
      <div className="p-2.5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-0.5">
          <span className="text-[9px] text-zinc-300 uppercase tracking-wide font-semibold">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[9px] text-zinc-200 font-bold">
              {product.rating}
            </span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-[13px] font-semibold text-white leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-[10px] text-zinc-300 line-clamp-1 mb-1">
          {product.description}
        </p>

        <div className="mt-auto">
          <span className="text-sm font-bold text-white">
            ₹{product.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
