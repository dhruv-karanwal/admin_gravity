import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title, 
  message, 
  icon = <Search className="w-12 h-12 text-on-surface-variant opacity-20" /> 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-low/30 rounded-xl">
      <div className="mb-6">{icon}</div>
      <h3 className="text-lg font-bold font-headline mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-xs mx-auto">{message}</p>
    </div>
  );
}
