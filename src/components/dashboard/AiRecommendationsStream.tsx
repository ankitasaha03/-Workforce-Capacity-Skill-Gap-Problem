'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  PlayCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  ArrowRight,
  Zap,
  GraduationCap,
  UserPlus,
  Coins,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Recommendation, RecommendationType, RiskLevel } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AiRecommendationsStreamProps {
  recommendations: Recommendation[];
  onSimulate: (rec: Recommendation) => void;
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
  activeSimulationId?: string | null;
}

export const AiRecommendationsStream: React.FC<AiRecommendationsStreamProps> = ({
  recommendations,
  onSimulate,
  onApprove,
  onDismiss,
  activeSimulationId,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  const filteredRecs = recommendations.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (urgencyFilter !== 'all' && r.urgency !== urgencyFilter) return false;
    return true;
  });

  const getTypeIcon = (type: RecommendationType) => {
    switch (type) {
      case 'reallocation':
        return <Zap className="w-4 h-4 text-indigo-400" />;
      case 'upskilling':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'hiring':
        return <UserPlus className="w-4 h-4 text-rose-400" />;
    }
  };

  const getUrgencyBadge = (urgency: RiskLevel) => {
    switch (urgency) {
      case 'Critical':
        return <Badge variant="danger" size="sm">Critical Urgency</Badge>;
      case 'High':
        return <Badge variant="warning" size="sm">High Urgency</Badge>;
      case 'Medium':
        return <Badge variant="secondary" size="sm">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline" size="sm">Low</Badge>;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              Actionable AI Recommendations Stream
            </CardTitle>
            <Badge variant="purple" size="sm">
              Live Synthesis
            </Badge>
          </div>
          <CardDescription>
            High-impact workforce reallocations, fast-track upskilling, and hiring optimizations
          </CardDescription>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type filters */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'reallocation', 'upskilling', 'hiring'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                  filterType === type
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>

          {/* Urgency filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="h-8 px-2.5 text-xs bg-slate-900 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Urgencies</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-5 pt-2">
        <div className="space-y-3.5">
          {filteredRecs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No recommendations match the current filters.
            </div>
          ) : (
            filteredRecs.map((rec) => {
              const isSimulating = activeSimulationId === rec.id;
              const isApproved = rec.status === 'approved';
              const isDismissed = rec.status === 'dismissed';

              return (
                <div
                  key={rec.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isSimulating
                      ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : isApproved
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : isDismissed
                      ? 'bg-slate-900/40 border-slate-800/40 opacity-50'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Main Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <div className="p-1 rounded-md bg-slate-800 border border-slate-700">
                          {getTypeIcon(rec.type)}
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100 truncate">
                          {rec.title}
                        </h4>
                        {getUrgencyBadge(rec.urgency)}
                        <Badge variant="outline" size="sm" className="text-[10px]">
                          {rec.department}
                        </Badge>
                        {isApproved && (
                          <Badge variant="success" size="sm" className="gap-1">
                            <CheckCheck className="w-3 h-3" /> Approved
                          </Badge>
                        )}
                        {isSimulating && (
                          <Badge variant="purple" size="sm" className="animate-pulse">
                            Active Simulation
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                        {rec.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-indigo-300 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          {rec.impactMetric}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <Coins className="w-3.5 h-3.5" />
                          Saves {formatCurrency(rec.costSavings)}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {rec.timeline}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                      {!isApproved && !isDismissed && (
                        <>
                          <Button
                            variant={isSimulating ? 'ai' : 'outline'}
                            size="sm"
                            onClick={() => onSimulate(rec)}
                            className="gap-1.5"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            {isSimulating ? 'Simulating' : 'Simulate'}
                          </Button>

                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => onApprove(rec.id)}
                            className="gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDismiss(rec.id)}
                            title="Dismiss recommendation"
                            className="text-slate-400 hover:text-rose-400"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {isApproved && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4" /> Added to Execution Plan
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSimulate(rec)}
                            className="text-xs text-slate-400"
                          >
                            Re-simulate
                          </Button>
                        </div>
                      )}

                      {isDismissed && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Dismissed</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onApprove(rec.id)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            Undo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
