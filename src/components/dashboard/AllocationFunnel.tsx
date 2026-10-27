'use client';

import React from 'react';
import { GitFork, ArrowRight, Zap, GraduationCap, UserPlus, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AllocationFunnelItem } from '@/types';

interface AllocationFunnelProps {
  funnelData: AllocationFunnelItem[];
  onSelectCategory?: (category: string) => void;
}

export const AllocationFunnel: React.FC<AllocationFunnelProps> = ({
  funnelData,
  onSelectCategory,
}) => {
  const getCategoryIcon = (category: string) => {
    if (category.includes('Reallocation')) {
      return <Zap className="w-4 h-4 text-indigo-400" />;
    }
    if (category.includes('Upskilling')) {
      return <GraduationCap className="w-4 h-4 text-emerald-400" />;
    }
    return <UserPlus className="w-4 h-4 text-rose-400" />;
  };

  const totalHeadcount = funnelData.reduce((acc, cur) => acc + cur.count, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>
              <GitFork className="w-4 h-4 text-indigo-400" />
              Strategic Allocation Funnel
            </CardTitle>
            <Badge variant="purple" size="sm">
              52 Recommended Actions
            </Badge>
          </div>
          <CardDescription>
            Workforce optimization path: Internal Reallocation vs. Upskilling vs. Direct Hiring
          </CardDescription>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-400">Total Actionable Slots:</span>{' '}
          <strong className="text-white font-mono text-sm">{totalHeadcount} Roles</strong>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        {/* Proportional Segment Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-300 font-medium mb-2">
            <span>Portfolio Optimization Breakdown</span>
            <span className="text-indigo-400 font-mono">82% Internal Mobility</span>
          </div>

          <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-800 p-0.5 gap-1">
            {funnelData.map((item) => (
              <div
                key={item.category}
                className="h-full rounded-full transition-all duration-500 hover:opacity-90 relative group"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.category}: ${item.percentage}% (${item.count} FTE)`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
            {funnelData.map((item) => (
              <div key={item.category} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="hidden md:inline">{item.category.split(' ')[1]}:</span>
                <span className="font-bold text-slate-200">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {funnelData.map((item) => (
            <div
              key={item.category}
              onClick={() => onSelectCategory?.(item.category)}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                    {getCategoryIcon(item.category)}
                  </div>
                  <Badge
                    variant={
                      item.category.includes('Reallocation')
                        ? 'default'
                        : item.category.includes('Upskilling')
                        ? 'success'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {item.statusTag}
                  </Badge>
                </div>

                <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {item.category}
                </h4>

                <div className="my-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {item.count}
                  </span>
                  <span className="text-xs text-slate-400">Target Roles</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  Estimated Cost:
                </span>
                <span className="font-semibold text-slate-200 font-mono text-[10px]">
                  {item.costEstimate}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Guidance */}
        <div className="mt-4 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between text-xs">
          <div className="text-slate-300">
            <strong className="text-indigo-300">WorkforceIQ Strategic Insight:</strong> Prioritizing internal reallocation and upskilling yields{' '}
            <strong className="text-emerald-400">$1.42M</strong> cost avoidance vs outside hiring.
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
};
