import React from 'react';

interface KineticCardProps {
  children: React.ReactNode;
  floating?: boolean;
  className?: string;
}

export default function KineticCard({ children, floating = false, className = "" }: KineticCardProps) {
  return (
    <div className={`kinetic-card ${floating ? 'ambient-glow' : ''} ${className}`}>
      {children}
    </div>
  );
}
