'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertOctagon,
  Clock,
  Coins,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { KpiMetricsData, SimulationDiff } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface KpiMetricsProps {
  metrics: KpiMetricsData;
  activeSimulationDiff?: SimulationDiff | null;
  onKpiClick?: (metricKey: string) => void;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({
  metrics,
  activeSimulationDiff,
  onKpiClick,
}) => {
  // If simulation is active, calculate projected values
  const simulatedSkillMatch = activeSimulationDiff
    ? Math.min(100, Math.round((metrics.skillMatchIndex + activeSimulationDiff.skillMatchDelta) * 10) / 10)
    : metrics.skillMatchIndex;

  const simulatedGaps = activeSimulationDiff
    ? Math.max(0, metrics.criticalSkillGaps + activeSimulationDiff.gapsDelta)
    : metrics.criticalSkillGaps;

  const simulatedDelayRisk = activeSimulationDiff
    ? Math.max(0, Math.round((metrics.projectDelayRisk + activeSimulationDiff.projectDelayRiskDelta) * 10) / 10)
    : metrics.projectDelayRisk;

  const simulatedCostSavings = activeSimulationDiff
    ? metrics.costSavings + activeSimulationDiff.costSavedDelta
    : metrics.costSavings;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Skill Match Index */}
      <Card
        className="relative overflow-hidden cursor-pointer group hover:border-indigo-500/50 transition-all"
        onClick={() => onKpiClick?.('skillMatch')}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Skill Match Index</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              +{metrics.skillMatchTrend}% QoQ
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {simulatedSkillMatch}%
            </span>
            {activeSimulationDiff && (
              <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +{activeSimulationDiff.skillMatchDelta}% (Simulated)
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Enterprise benchmark: 75.0%</span>
              <span className="text-indigo-400 font-medium">Optimal Band</span>
            </div>
            <Progress
              value={simulatedSkillMatch}
              variant={simulatedSkillMatch >= 80 ? 'success' : 'default'}
              className="h-1.5"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Critical Skill Gaps */}
      <Card
        className="relative overflow-hidden cursor-pointer group hover:border-rose-500/50 transition-all"
        onClick={() => onKpiClick?.('skillGaps')}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 group-hover:scale-105 transition-transform">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Critical Skill Gaps</span>
            </div>
            <span className="text-[11px] text-slate-400">Open Gaps</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {simulatedGaps}
            </span>
            {activeSimulationDiff && (
              <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
                {activeSimulationDiff.gapsDelta} closed
              </span>
            )}
          </div>

          {/* Risk Badges */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <Badge variant="danger" size="sm">
              High: {Math.max(0, metrics.gapBreakdown.high + (activeSimulationDiff ? -3 : 0))}
            </Badge>
            <Badge variant="warning" size="sm">
              Med: {Math.max(0, metrics.gapBreakdown.medium + (activeSimulationDiff ? -2 : 0))}
            </Badge>
            <Badge variant="secondary" size="sm">
              Low: {metrics.gapBreakdown.low}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 3. Project Delay Risk */}
      <Card
        className="relative overflow-hidden cursor-pointer group hover:border-amber-500/50 transition-all"
        onClick={() => onKpiClick?.('delayRisk')}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Project Delay Risk</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingDown className="w-3 h-3" />
              {metrics.projectDelayTrend}%
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {simulatedDelayRisk}%
            </span>
            {activeSimulationDiff && (
              <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
                {activeSimulationDiff.projectDelayRiskDelta}% (Simulated)
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Blocked Projects</span>
              <span className="text-amber-400 font-medium">3 of 14 Squads</span>
            </div>
            <Progress
              value={simulatedDelayRisk}
              variant={simulatedDelayRisk > 20 ? 'warning' : 'success'}
              className="h-1.5"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Optimization Efficiency */}
      <Card
        className="relative overflow-hidden cursor-pointer group hover:border-emerald-500/50 transition-all"
        onClick={() => onKpiClick?.('optimization')}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Optimization Savings</span>
            </div>
            <Badge variant="success" size="sm">
              +{metrics.efficiencyGain}% Efficiency
            </Badge>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {formatCurrency(simulatedCostSavings)}
            </span>
            {activeSimulationDiff && (
              <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +{formatCurrency(activeSimulationDiff.costSavedDelta)}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Reallocation vs External Hiring</span>
            <span className="text-emerald-400 font-medium">ROI 4.2x</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
