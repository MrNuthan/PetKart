import React from 'react';
import { PetCategory } from '../types';
import { ChevronDown, Star, LayoutGrid, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface TopFilterBarProps {
  activeCategory: PetCategory;
  onCategoryChange: (category: PetCategory) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  sortBy: string;
  onSortChange: (sort: any) => void;
  onReset: () => void;
}

const CATEGORIES: PetCategory[] = ['All', 'Dog', 'Cat', 'Bird', 'Fish'];
const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'low-to-high', label: 'Price: Low to High' },
  { value: 'high-to-low', label: 'Price: High to Low' },
];

export const TopFilterBar: React.FC<TopFilterBarProps> = ({
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onRatingChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="bg-white border-y border-slate-100 shadow-sm sticky top-20 z-40">
      <div className="container-custom">
        <div className="py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between overflow-x-auto no-scrollbar">
          
          {/* Main Filters Group */}
          <div className="flex items-center gap-2 min-w-max">
            {/* Category Dropdown */}
            <div className="relative group mr-2">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 shadow-lg shadow-slate-900/10 rounded-2xl text-sm font-black text-white hover:bg-slate-800 transition-all uppercase tracking-widest">
                <LayoutGrid className="w-4 h-4" />
                {activeCategory === 'All' ? 'Categories' : activeCategory}
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-50 p-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all",
                      activeCategory === cat 
                        ? "bg-primary text-white font-black shadow-md shadow-primary/20" 
                        : "hover:bg-slate-50 text-slate-700 font-bold"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />

            {/* Price & Rating Buttons */}
            <div className="flex items-center gap-3 pl-2">
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 hover:border-primary transition-colors">
                  Price: Up to ${priceRange[1]}
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-50 p-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Max Price</h5>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([0, parseInt(e.target.value)])}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary mb-2"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span>$0</span>
                    <span className="text-primary">${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 hover:border-primary transition-colors">
                  Rating: {minRating === 0 ? 'Any' : `${minRating}+`}
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-50 p-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
                  {[4, 3, 2, 0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => onRatingChange(rating)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-colors",
                        minRating === rating 
                          ? "bg-primary/10 text-primary font-bold" 
                          : "hover:bg-slate-50 text-slate-600 font-medium"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {rating === 0 ? (
                          <span>Any Rating</span>
                        ) : (
                          <>
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn("w-3.5 h-3.5", i < rating ? "fill-primary text-primary" : "text-slate-200")} 
                              />
                            ))}
                            <span className="ml-1">& Up</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Sort & Reset */}
          <div className="flex items-center gap-4 min-w-max">
            <div className="h-8 w-px bg-slate-100 hidden lg:block" />
            
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-transparent focus-within:border-primary/20 transition-all">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-900 border-none outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onReset}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors px-2"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest hidden xl:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
