"use client";

import React from 'react';
import GlassModal from './GlassModal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
}: ConfirmModalProps) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={title}
      width="420px"
      footer={
        <>
          <button 
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className={`${danger ? 'bg-error' : 'bg-primary'} text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2`}
            disabled={loading}
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-4">
        {danger && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
            <AlertTriangle size={24} />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </GlassModal>
  );
}
