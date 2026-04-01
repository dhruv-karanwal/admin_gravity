"use client";

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ArrowRight
} from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export default function InsightCard({ 
  title, 
  description, 
  type, 
  icon, 
  actionLabel, 
  onAction 
}: InsightCardProps) {
  const styles = {
    positive: "bg-tertiary/5 border-tertiary/10 text-tertiary",
    negative: "bg-primary/5 border-primary/10 text-primary",
    warning: "bg-secondary/5 border-secondary/10 text-secondary",
    neutral: "bg-on-surface-variant/5 border-on-surface-variant/10 text-on-surface-variant/70",
  };

  const Icon = {
    positive: <TrendingUp size={18} />,
    negative: <TrendingDown size={18} />,
    warning: <AlertCircle size={18} />,
    neutral: <Info size={18} />,
  }[type];

  return (
    <div className={`p-5 rounded-2xl border flex gap-4 transition-all hover:translate-x-1 duration-300 ${styles[type]}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${styles[type].replace('text-', 'bg-').replace('/5', '/10')}`}>
        {icon || Icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-black uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-[11px] font-bold text-on-surface/80 leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>
        {actionLabel && (
          <button 
            onClick={onAction}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest hover:underline"
          >
            {actionLabel} <ArrowRight size={10} />
          </button>
        )}
      </div>
    </div>
  );
}
