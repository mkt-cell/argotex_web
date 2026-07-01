import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = 'px-5 py-2.5 rounded-md font-medium text-sm transition-all duration-200 inline-flex items-center justify-center cursor-pointer';
  
  const variants = {
    primary: 'bg-medical-teal text-white hover:bg-medical-teal/90 shadow-sm',
    secondary: 'bg-slate-800 text-white hover:bg-slate-800/90 shadow-sm',
    outline: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-100',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
