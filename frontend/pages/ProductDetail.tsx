
import React, { useState, useEffect } from 'react';
// Fix: Importing from 'react-router' to resolve 'no exported member' errors in this environment
import { useParams, useNavigate } from 'react-router';
import { Star, Shield, Truck, RotateCcw, Plus, Minus, ShoppingBag } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await productService.getProduct(id);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        } else {
          setSelectedImage(data.image);
        }
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold">Product not found.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="glass rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 aspect-square">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {(product.images || []).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-zinc-700'}`} />
                  ))}
                </div>
                <span className="text-sm text-zinc-500 font-medium">({product.rating} / 5.0)</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">${product.price}</p>
              <p className="text-zinc-400 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-dark-700 rounded-full border border-white/5 px-2 py-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 text-lg font-bold w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-zinc-500 text-sm font-medium">{product.stock} units available</span>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) addToCart(product);
                  }}
                  className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-all flex items-center justify-center space-x-3 shadow-lg shadow-primary/30"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => product && toggleFavorite(product)}
                  className="p-4 border border-white/10 rounded-full hover:bg-white/5 transition-all group"
                  title={product && isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${product && isFavorite(product.id)
                        ? 'text-primary-coral fill-primary-coral'
                        : 'text-zinc-400 group-hover:text-primary-coral'
                      }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold text-white uppercase tracking-tighter">Fast Delivery</span>
                <span className="text-[10px] text-zinc-500">2-4 Business Days</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Shield className="w-6 h-6 text-emerald-500" />
                <span className="text-xs font-bold text-white uppercase tracking-tighter">2-Year Warranty</span>
                <span className="text-[10px] text-zinc-500">Global Protection</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RotateCcw className="w-6 h-6 text-violet-500" />
                <span className="text-xs font-bold text-white uppercase tracking-tighter">Easy Returns</span>
                <span className="text-[10px] text-zinc-500">30-Day Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
