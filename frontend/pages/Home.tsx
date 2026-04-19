
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types';
import { Filter, Heart, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const PRODUCTS_PER_PAGE = 12;

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const [products, cats] = await Promise.all([
        productService.getProducts(selectedCategory === 'All' ? undefined : selectedCategory, searchQuery),
        productService.getCategories()
      ]);
      setFeaturedProducts(products);
      setCategories(['All', ...cats.map((c: any) => c.name)]);
    } catch (error: any) {
      console.error("Failed to fetch home data", error);
      const statusCode = error?.response?.status || error?.status;
      if (statusCode === 500) {
        setError("Server error — the team has been notified. Please try again in a moment.");
      } else if (statusCode === 0 || !statusCode) {
        setError("Cannot connect to the server. Please check your connection and try again.");
      } else {
        setError("Something went wrong loading products. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery]);


  useEffect(() => {
    if (searchQuery && !isLoading && productsRef.current) {
      setTimeout(() => {
        scrollToProducts();
      }, 100);
    }
  }, [searchQuery, isLoading]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalPages = Math.ceil(featuredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = featuredProducts.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToProducts();
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToProducts();
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8 pt-10 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-5 md:space-y-6"
          >
            <div className="flex items-center space-x-2 text-[10px] font-black tracking-[0.3em] text-primary uppercase">
              <Heart className="w-3 h-3 text-primary-coral" />
              <span>The Gold Standard for Furry Family</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-extrabold text-white tracking-tighter leading-none pb-2">
              PET<span className="aura-gradient-text">KART</span>
            </h1>

            <p className="text-zinc-50 text-sm md:text-base max-w-xl font-medium leading-relaxed">
              Premium nutrition and thoughtfully designed accessories for pets you treat like family.
              From wholesome meals to beautifully crafted essentials, every product at PetKart is chosen to elevate
              your pet's health, comfort, and happiness—because they deserve the very best, every day.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <motion.button
                onClick={scrollToProducts}
                whileTap={{ scale: 0.97 }}
                className="aura-btn px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-white font-bold text-xs md:text-sm uppercase tracking-widest flex items-center group transition-all"
              >
                Shop the Collection
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-30 animate-glow-pulse" />
            <div className="relative glass p-4 rounded-[3rem] border border-white/5 hover:rotate-0 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600"
                alt="Premium Pet Care"
                className="w-72 h-96 object-cover rounded-[2.5rem]"
              />
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-3xl border border-white/10 shadow-2xl">
                <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                <p className="text-xs font-black text-white uppercase tracking-widest">100% Organic</p>
                <p className="text-[10px] text-zinc-500 uppercase">Vet Certified</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Bar */}
        <motion.div
          ref={productsRef}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 md:px-8 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-black whitespace-nowrap transition-all border ${selectedCategory === cat
                  ? 'aura-btn border-transparent text-white'
                  : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10 hover:text-zinc-300'
                  }`}
              >
                {cat.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-[2rem] overflow-hidden animate-pulse">
                <div className="aspect-square bg-zinc-900" />
                <div className="p-6 space-y-4">
                  <div className="h-2 bg-zinc-800 rounded w-1/4" />
                  <div className="h-5 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 md:py-32 text-center glass rounded-[3rem] border border-red-500/20"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Unable to load products
            </h3>
            <p className="text-zinc-400 font-light tracking-wide mb-6 text-sm md:text-base px-4 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={fetchData}
              className="mt-2 px-8 py-3 aura-btn text-white font-bold rounded-full text-sm uppercase tracking-widest transition-all hover:scale-105"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <div>
            {featuredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {paginatedProducts.map((p, index) => (
                    <ProductCard key={p.id} product={p} index={index} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3 md:gap-4">
                    <motion.button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                      className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all ${currentPage === 1
                        ? 'bg-zinc-900/50 text-zinc-700 cursor-not-allowed border border-white/5'
                        : 'aura-btn text-white hover:scale-105'
                        }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </motion.button>

                    <div className="glass px-4 md:px-6 py-2.5 md:py-3 rounded-full border border-white/10">
                      <span className="text-white font-bold text-xs md:text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <motion.button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
                      className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all ${currentPage === totalPages
                        ? 'bg-zinc-900/50 text-zinc-700 cursor-not-allowed border border-white/5'
                        : 'aura-btn text-white hover:scale-105'
                        }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-24 md:py-32 text-center glass rounded-[3rem] border border-white/5"
              >
                <Filter className="w-12 h-12 md:w-16 md:h-16 text-zinc-800 mx-auto mb-6" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {searchQuery ? 'No products found' : 'Universe is silent'}
                </h3>
                <p className="text-zinc-500 font-light tracking-wide mb-6 text-sm md:text-base px-4">
                  {searchQuery
                    ? `No items match your search "${searchQuery}". Try different keywords.`
                    : "No items found in this cosmic coordinate."
                  }
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => navigate('/')}
                    className="mt-2 px-8 py-3 aura-btn text-white font-bold rounded-full text-sm uppercase tracking-widest transition-all"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="mt-2 text-primary font-bold hover:underline"
                  >
                    Return to all items
                  </button>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
