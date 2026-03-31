import React from 'react';

type Status = 'active' | 'expiring' | 'expired' | 'inactive' | 'confirmed' | 'cancelled' | 'attended';

interface StatusChipProps {
  status: Status;
  className?: string;
}

export default function StatusChip({ status, className = "" }: StatusChipProps) {
  const getChipClass = () => {
    switch (status) {
      case 'active':
      case 'attended':
      case 'confirmed':
        return 'chip-active';
      case 'expiring':
        return 'chip-expiring';
      case 'expired':
      case 'cancelled':
      case 'inactive':
        return 'chip-expired';
      default:
        return '';
    }
  };

  return (
    <span className={`${getChipClass()} inline-block text-[10px] font-bold uppercase tracking-widest ${className}`}>
      {status}
    </span>
  );
}
