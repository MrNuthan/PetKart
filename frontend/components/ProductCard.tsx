import React from 'react';
import { Link } from 'react-router';
import { Plus, Star, ShieldCheck, Leaf } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const getBadge = () => {
    if (product.category === 'Food') return { text: 'Grain-Free', icon: Leaf, color: 'text-emerald-400' };
    if (product.category === 'Health') return { text: 'Vet Approved', icon: ShieldCheck, color: 'text-indigo-400' };
    if (product.featured) return { text: 'Top Seller', icon: Star, color: 'text-yellow-400' };
    return null;
  };

  const badge = getBadge();

  return (
    <div className="group bg-zinc-900 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full w-full">
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

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-pink-600 text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wide hover:bg-pink-700 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          ADD TO BAG
        </button>
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
    </div>
  );
};

export default ProductCard;
