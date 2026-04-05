"use client";

import React from 'react';
import { 
  ArrowRight
} from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  accentColor?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** @deprecated use icon and accentColor instead */
  type?: 'positive' | 'negative' | 'neutral' | 'warning';
}

export default function InsightCard({ 
  title, 
  description, 
  icon, 
  accentColor = "#af000b",
  actionLabel, 
  onAction 
}: InsightCardProps) {
  return (
    <div className="p-4 bg-white hover:bg-surface-low transition-all duration-300 flex gap-4 group cursor-pointer border-b border-outline-variant/5 last:border-0">
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: accentColor }}>
          {title}
        </h4>
        <p className="text-[12px] font-medium text-on-surface leading-snug mb-3">
          {description}
        </p>
        {actionLabel && (
          <button 
            onClick={onAction}
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
