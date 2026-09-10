import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'mint' | 'amber' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "font-extrabold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeStyles = {
    sm: "text-xs px-3 py-2",
    md: "text-xs px-5 py-3",
    lg: "text-sm px-7 py-3.5 rounded-2xl",
  };

  const variantStyles = {
    primary: "bg-blue-700 hover:bg-blue-800 text-white shadow-luxury hover:scale-[1.02]",
    secondary: "bg-white hover:bg-slate-100 text-slate-900 border border-slate-900/[0.08] shadow-sm hover:scale-[1.02]",
    mint: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-luxury hover:scale-[1.02]",
    amber: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:scale-[1.02]",
    ghost: "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-900/[0.08]",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
