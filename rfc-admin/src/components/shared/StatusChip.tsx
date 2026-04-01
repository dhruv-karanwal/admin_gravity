import React from 'react';

type Status = 'active' | 'expiring' | 'expired' | 'inactive' | 'confirmed' | 'cancelled' | 'attended';

interface StatusChipProps {
  status: Status;
  className?: string;
}

export default function StatusChip({ status, className = "" }: StatusChipProps) {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'attended':
      case 'confirmed':
        return { bg: '#a3f69c', color: '#002204' };
      case 'expiring':
        return { bg: '#fff3e0', color: '#e65100' };
      case 'expired':
      case 'cancelled':
      case 'inactive':
        return { bg: '#fdeaea', color: '#af000b' };
      default:
        return { bg: '#f0f0f0', color: '#5d3f3c' };
    }
  };

  const s = getStyles();

  return (
    <span 
      style={{ 
        background: s.bg, 
        color: s.color,
        borderRadius: '9999px',
        padding: '3px 12px',
        fontFamily: 'var(--font-inter)',
        fontWeight: 600,
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}
      className={`inline-block border-none ${className}`}
    >
      {status}
    </span>
  );
}
