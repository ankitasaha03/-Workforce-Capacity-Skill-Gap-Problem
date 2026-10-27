'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Share2,
  Printer,
  Sparkles,
  Building,
  Target,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KpiMetricsData, Department } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ExportAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: KpiMetricsData;
  enterpriseName: string;
  department: Department;
}

export const ExportAuditModal: React.FC<ExportAuditModalProps> = ({
  isOpen,
  onClose,
  metrics,
  enterpriseName,
  department,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Trigger simple client-side file download of the summary
      const summaryText = `WORKFORCEIQ EXECUTIVE BRIEF
Generated: ${new Date().toLocaleDateString()}
Enterprise: ${enterpriseName}
Department Scope: ${department}

KEY PERFORMANCE INDICATORS:
- Skill Match Index: ${metrics.skillMatchIndex}% (Trend: +${metrics.skillMatchTrend}%)
- Critical Skill Gaps: ${metrics.criticalSkillGaps} Gaps (High: ${metrics.gapBreakdown.high}, Med: ${metrics.gapBreakdown.medium})
- Project Delay Risk: ${metrics.projectDelayRisk}%
- Internal Optimization Cost Avoidance: ${formatCurrency(metrics.costSavings)}
- Efficiency Gain: +${metrics.efficiencyGain}%

STRATEGIC DIRECTIVES:
1. Reallocate 3 Senior DevOps Engineers to resolve Q3 Cloud Migration bottleneck.
2. Launch 6-Week GenAI Upskilling Cohort for 12 Backend Engineers.
3. Reserve direct hiring budget for 2 Lead Quantum Security Specialists.
`;
      const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `WorkforceIQ-Executive-Brief-${department.replace(/\s+/g, '-')}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }, 800);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Workforce Intelligence Executive Brief</h3>
            <p className="text-xs text-slate-400">Board-Ready Capacity & Skill Gap Strategy Report</p>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Document Header Preview */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
            <div>
              <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
                {enterpriseName}
              </span>
              <p className="text-[10px] text-slate-400">Quarterly Workforce Readiness & Capacity Audit</p>
            </div>
            <Badge variant="purple" size="sm">
              Confidential / Internal
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Skill Match</span>
              <strong className="text-sm font-mono text-white">{metrics.skillMatchIndex}%</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Critical Gaps</span>
              <strong className="text-sm font-mono text-rose-400">{metrics.criticalSkillGaps}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Delay Risk</span>
              <strong className="text-sm font-mono text-amber-400">{metrics.projectDelayRisk}%</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Savings</span>
              <strong className="text-sm font-mono text-emerald-400">{formatCurrency(metrics.costSavings)}</strong>
            </div>
          </div>

          <div className="space-y-2 text-slate-300 leading-relaxed text-[11px]">
            <p>
              <strong>Executive Summary:</strong> An audit of {department} reveals high concentration of adjacent engineering talent suitable for internal strategic mobility. With 24 underutilized FTEs and an urgent Q3 demand surge in GenAI and Platform Engineering, internal mobility pathways will generate <strong>{formatCurrency(metrics.costSavings)}</strong> in cost avoidance and safeguard project delivery timelines.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleShare}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Link Copied!' : 'Copy Shareable Link'}
          </button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="success"
              size="sm"
              loading={downloading}
              onClick={handleDownload}
              className="gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download Brief (.txt)
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
