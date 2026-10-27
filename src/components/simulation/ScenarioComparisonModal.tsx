'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Check,
  RotateCcw,
  DollarSign,
  AlertOctagon,
  Target,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KpiMetricsData, Recommendation, SimulationDiff } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ScenarioComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKpis: KpiMetricsData;
  activeRec: Recommendation | null;
  onApplySimulation: (title: string, diff: SimulationDiff) => void;
}

export const ScenarioComparisonModal: React.FC<ScenarioComparisonModalProps> = ({
  isOpen,
  onClose,
  currentKpis,
  activeRec,
  onApplySimulation,
}) => {
  const defaultDiff: SimulationDiff = activeRec
    ? activeRec.simulationDiff
    : {
        skillMatchDelta: 6.7,
        gapsDelta: -7,
        projectDelayRiskDelta: -14.0,
        costSavedDelta: 420000,
        efficiencyGainDelta: 5.2,
        details: [
          'Reallocates 3 DevOps Specialists to Tier-1 Cloud Migration',
          'Enrolls 12 Backend Engineers in Accelerated GenAI Pathway',
          'Eliminates 3-week project delay for Q3 enterprise rollout',
        ],
      };

  const scenarioTitle = activeRec ? activeRec.title : 'Comprehensive Workforce Optimization Strategy';

  const beforeAfterData = [
    {
      metric: 'Skill Match Index',
      before: `${currentKpis.skillMatchIndex}%`,
      after: `${Math.min(100, Number((currentKpis.skillMatchIndex + defaultDiff.skillMatchDelta).toFixed(1)))}%`,
      delta: `+${defaultDiff.skillMatchDelta}%`,
      isPositive: true,
      icon: <Target className="w-4 h-4 text-indigo-400" />,
    },
    {
      metric: 'Critical Skill Gaps',
      before: `${currentKpis.criticalSkillGaps} Gaps`,
      after: `${Math.max(0, currentKpis.criticalSkillGaps + defaultDiff.gapsDelta)} Gaps`,
      delta: `${defaultDiff.gapsDelta} Resolved`,
      isPositive: true,
      icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
    },
    {
      metric: 'Project Delay Risk',
      before: `${currentKpis.projectDelayRisk}%`,
      after: `${Math.max(0, Number((currentKpis.projectDelayRisk + defaultDiff.projectDelayRiskDelta).toFixed(1)))}%`,
      delta: `${defaultDiff.projectDelayRiskDelta}%`,
      isPositive: true,
      icon: <Clock className="w-4 h-4 text-amber-400" />,
    },
    {
      metric: 'Hiring Cost Avoidance',
      before: formatCurrency(currentKpis.costSavings),
      after: formatCurrency(currentKpis.costSavings + defaultDiff.costSavedDelta),
      delta: `+${formatCurrency(defaultDiff.costSavedDelta)}`,
      isPositive: true,
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
    },
  ];

  const handleApply = () => {
    onApplySimulation(scenarioTitle, defaultDiff);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Scenario Planning Simulator</h3>
            <p className="text-xs text-slate-400">Before vs. After Strategic Capacity Modeling</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Scenario Banner */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              Evaluating Scenario:
            </span>
            <h4 className="text-sm font-semibold text-white mt-0.5">{scenarioTitle}</h4>
          </div>
          <Badge variant="purple" size="sm">
            AI Modeled
          </Badge>
        </div>

        {/* Before vs After Metric Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {beforeAfterData.map((item) => (
            <div
              key={item.metric}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/80">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{item.metric}</span>
                </div>
                <Badge variant="success" size="sm" className="font-mono text-[11px]">
                  {item.delta}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Current (Before)</span>
                  <span className="text-base font-bold font-mono text-slate-400">{item.before}</span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500" />

                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 uppercase block font-medium">Projected (After)</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{item.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Narrative Details */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h5 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Key Operational Changes Modeled:
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {defaultDiff.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Simulation can be reverted at any time from the dashboard banner.
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="ai" size="sm" onClick={handleApply} className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Apply Live to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
