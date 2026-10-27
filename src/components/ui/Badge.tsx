import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    secondary: 'bg-slate-800 text-slate-300 border-slate-700',
    outline: 'border border-slate-700 text-slate-300 bg-transparent',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  }[variant];

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border transition-colors',
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
