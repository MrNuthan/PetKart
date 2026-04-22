import React from 'react';
import { Skeleton } from './ui/Skeleton';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm flex flex-col h-full">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/5] rounded-[1.5rem] mb-6 w-full" />
      
      <div className="px-2 space-y-3 flex-1">
        {/* Rating stars skeleton */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 rounded-full" />
          ))}
          <Skeleton className="w-10 h-4 ml-2" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-5/6 rounded-md" />
        </div>

        {/* Price and Category skeleton */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};
