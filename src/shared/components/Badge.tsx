import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'neutral' | 'blue';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  className = '',
}) => {
  const variantStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
    neutral: "bg-slate-100 text-slate-600 border border-slate-900/[0.08]",
    blue: "bg-blue-50 text-blue-700 border border-blue-500/20",
  };

  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm inline-flex items-center gap-1 ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
