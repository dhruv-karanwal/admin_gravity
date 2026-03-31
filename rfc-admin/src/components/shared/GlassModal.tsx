"use client";

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export default function GlassModal({ 
  open, 
  onClose, 
  title, 
  children, 
  footer, 
  width = "540px" 
}: GlassModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-on-surface/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        ref={modalRef}
        className="glass-modal w-full flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-low">
          <h3 className="headline-sm">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-low transition-colors text-on-surface-variant hover:text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-surface-low flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
      
      {/* Backdrop Click */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
