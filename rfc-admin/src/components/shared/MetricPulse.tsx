import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricPulseProps {
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | null;
  delta?: string;
  className?: string;
}

export default function MetricPulse({ value, label, trend, delta, className = "" }: MetricPulseProps) {
  return (
    <div className={`kinetic-card ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest font-label">
          {label}
        </span>
        {trend === 'up' && <span className="flex h-2 w-2 rounded-full bg-tertiary"></span>}
        {trend === 'down' && <span className="flex h-2 w-2 rounded-full bg-error"></span>}
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-bold font-headline">{value}</h3>
        {delta && (
          <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-tertiary' : 'text-error'}`}>
            {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
