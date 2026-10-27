import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'ai';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary:
        'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:translate-y-0.5 border border-indigo-500/30',
      secondary:
        'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60 active:translate-y-0.5',
      outline:
        'bg-transparent hover:bg-slate-800/80 text-slate-200 border border-slate-700 active:translate-y-0.5',
      ghost:
        'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
      danger:
        'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 active:translate-y-0.5',
      success:
        'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:translate-y-0.5 border border-emerald-500/30',
      ai:
        'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-md shadow-purple-500/25 hover:opacity-95 active:scale-[0.98] border border-purple-400/30',
    }[variant];

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs rounded-lg',
      md: 'h-9 px-4 text-xs font-medium rounded-lg',
      lg: 'h-11 px-5 text-sm font-medium rounded-xl',
      icon: 'h-9 w-9 p-0 rounded-lg flex items-center justify-center',
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
          variantStyles,
          sizeStyles,
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
