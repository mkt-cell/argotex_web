import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-validation-green bg-validation-green/10 px-2.5 py-1.5 rounded border border-validation-green/20 w-fit ${className}`}>
      {children}
    </span>
  );
};
