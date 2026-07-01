import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = true }) => {
  const baseStyle = 'bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-300';
  const hoverStyle = hoverable ? 'hover:shadow-md hover:border-slate-300 hover:-translate-y-1' : '';

  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
};
