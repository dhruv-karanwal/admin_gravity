import React from 'react';

interface LoadingShimmerProps {
  variant?: 'cards' | 'table' | 'detail' | 'dashboard';
}

export default function LoadingShimmer({ variant = 'table' }: LoadingShimmerProps) {
  const shimmerClass = "animate-pulse bg-[#f5f3f3] rounded-xl";

  if (variant === 'dashboard') {
    return (
      <div className="space-y-8 p-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-36 w-full ${shimmerClass}`}></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 h-[400px] w-full ${shimmerClass}`}></div>
          <div className={`h-[400px] w-full ${shimmerClass}`}></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-48 w-full ${shimmerClass}`}></div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="kinetic-card h-32 flex flex-col justify-between">
            <div className={`h-4 w-1/2 ${shimmerClass}`}></div>
            <div className={`h-10 w-3/4 ${shimmerClass}`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="kinetic-card p-0 overflow-hidden">
        <div className={`h-12 w-full mb-1 ${shimmerClass}`}></div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`h-14 w-full mb-1 opacity-60 ${shimmerClass}`}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`h-64 w-full ${shimmerClass}`}></div>
      <div className="grid grid-cols-2 gap-6">
        <div className={`h-32 w-full ${shimmerClass}`}></div>
        <div className={`h-32 w-full ${shimmerClass}`}></div>
      </div>
    </div>
  );
}
