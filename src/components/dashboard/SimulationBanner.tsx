'use client';

import React from 'react';
import { PlayCircle, Check, X, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Recommendation, SimulationDiff } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SimulationBannerProps {
  simulationTitle: string;
  diff: SimulationDiff;
  onCommit: () => void;
  onExit: () => void;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({
  simulationTitle,
  diff,
  onCommit,
  onExit,
}) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-slate-900 border border-indigo-500/40 p-4 shadow-xl shadow-indigo-950/40 animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Indicator & Title */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm" className="font-semibold uppercase tracking-wider">
                Active Scenario Simulation
              </Badge>
              <span className="text-xs text-slate-400">Dashboard metrics updated in real-time</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {simulationTitle}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Skill Match: +{diff.skillMatchDelta}%
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Gaps Closed: {diff.gapsDelta}
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Delay Risk: {diff.projectDelayRiskDelta}%
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Avoided Cost: +{formatCurrency(diff.costSavedDelta)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onExit}
            className="text-xs text-slate-300 hover:text-white"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Exit Simulation
          </Button>

          <Button
            variant="success"
            size="sm"
            onClick={onCommit}
            className="text-xs shadow-emerald-500/20"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Commit to Active Plan
          </Button>
        </div>
      </div>
    </div>
  );
};
