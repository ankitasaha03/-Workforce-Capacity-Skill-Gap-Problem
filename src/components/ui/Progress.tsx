import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
  max?: number;
  indicatorClassName?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gradient';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  indicatorClassName,
  variant = 'default',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantStyles = {
    default: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  }[variant];

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-800', className)}
      {...props}
    >
      <div
        className={cn('h-full transition-all duration-500 ease-out rounded-full', variantStyles, indicatorClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
