"use client";

import React from 'react';
import { useAppStore } from '@/store/appStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastQueue, hideToast } = useAppStore();

  if (toastQueue.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toastQueue.map((toast) => (
        <div 
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-ambient-glow border border-white/20 animate-in slide-in-from-right duration-300
            ${toast.type === 'success' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : ''}
            ${toast.type === 'error' ? 'bg-[#fdeaea] text-primary' : ''}
            ${toast.type === 'warning' ? 'bg-[#fff3e0] text-[#e65100]' : ''}
          `}
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'warning' && <Info size={18} />}
          </div>
          <p className="text-sm font-semibold">{toast.message}</p>
          <button 
            onClick={() => hideToast(toast.id)}
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
