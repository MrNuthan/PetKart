import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { Hero } from '../components/Hero';
import { productService } from '../services/productService';
import { Product } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search as SearchIcon,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';

const PRODUCTS_PER_PAGE = 12;

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>(
    'default'
  );
  const productsRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(
          selectedCategory === 'All' ? undefined : selectedCategory,
          searchQuery
        ),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(['All', ...cats.map((c: any) => c.name)]);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 500) {
        setError('Server error — please try again in a moment.');
      } else if (!status) {
        setError('Cannot connect to the server. Is the backend running?');
      } else {
        setError('Something went wrong loading products.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // FIX #4: Auto-scroll to products section when there's a search query in the URL
  useEffect(() => {
    if (searchQuery) {
      // Small delay to let the fetch complete and results render
      const timer = setTimeout(() => scrollToProducts(), 400);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Sort
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToProducts();
  };

  return (
    <div>
      {/* Hero */}
      <Hero onExplore={scrollToProducts} />

      {/* Products Section */}
      <section id="products" ref={productsRef} className="py-16 bg-white">
        <div className="container-custom">
          {/* Section Header + Filters */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : selectedCategory === 'All'
                  ? 'All Products'
                  : `${selectedCategory} Products`}
              </h2>
              {!isLoading && (
                <p className="text-slate-400 font-medium mt-1">
                  {sortedProducts.length} products found
                </p>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (searchQuery) navigate('/');
                }}
                className={cn(
                  'flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all border',
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-primary/30 hover:text-primary'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active search tag */}
          {searchQuery && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-bold px-3 py-1.5 rounded-full">
                <SearchIcon className="w-3.5 h-3.5" />
                {searchQuery}
                <button onClick={() => navigate('/')} className="ml-1 hover:opacity-70">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden animate-pulse bg-slate-100">
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-2 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-24 text-center bg-red-50 rounded-3xl border border-red-100">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to load products</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">{error}</p>
              <button
                onClick={fetchData}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary/90 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="py-24 text-center bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
              <SearchIcon className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Try a different search term or category.
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); navigate('/'); }}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary/90 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold border border-slate-200 hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={cn(
                        'w-9 h-9 rounded-full text-sm font-bold transition-all',
                        currentPage === i + 1
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'border border-slate-200 text-slate-600 hover:border-primary/30'
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold border border-slate-200 hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
