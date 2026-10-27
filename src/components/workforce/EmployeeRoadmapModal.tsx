'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Target,
  Send,
  Building,
  Award,
  BookOpen,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Employee } from '@/types';

interface EmployeeRoadmapModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignPathway?: (employeeId: string, pathwayName: string) => void;
  onProposeReallocation?: (employeeId: string, targetProject: string) => void;
}

export const EmployeeRoadmapModal: React.FC<EmployeeRoadmapModalProps> = ({
  employee,
  isOpen,
  onClose,
  onAssignPathway,
  onProposeReallocation,
}) => {
  const [assignedStatus, setAssignedStatus] = useState<string | null>(null);

  if (!employee) return null;

  const { roadmap } = employee;

  const handleAssign = () => {
    setAssignedStatus('Pathway Assigned!');
    onAssignPathway?.(employee.id, roadmap.targetRole);
    setTimeout(() => setAssignedStatus(null), 3000);
  };

  const handleReallocate = (projectName: string) => {
    setAssignedStatus(`Reallocation proposed to ${projectName}`);
    onProposeReallocation?.(employee.id, projectName);
    setTimeout(() => setAssignedStatus(null), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{employee.name}</span>
              <Badge variant="purple" size="sm">
                Growth Score: {employee.growthPotential}/100
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {employee.role} • {employee.department} • {employee.location}
            </p>
          </div>
        </div>
      }
      description="Personalized AI Skill Gap Diagnostics, Upskilling Pathway & Internal Mobility Match"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Target Strategic Role</span>
            <p className="text-sm font-bold text-white mt-0.5">{roadmap.targetRole}</p>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span className="uppercase font-semibold">Target Readiness</span>
              <span className="text-indigo-400 font-bold">{roadmap.currentReadiness}%</span>
            </div>
            <Progress value={roadmap.currentReadiness} variant="gradient" className="h-2" />
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Current Workload</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-white font-mono">{employee.utilization}%</span>
              <span className="text-xs text-slate-400">({employee.availabilityHours} hrs free/wk)</span>
            </div>
          </div>
        </div>

        {/* Primary Gap Diagnostic Alert */}
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-rose-300">Diagnostic Skill Gap: </span>
            <span className="text-slate-200">{roadmap.primaryGap}</span>
          </div>
        </div>

        {/* Current Skills Inventory */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            Verified Skill Inventory & Proficiency
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {employee.skills.map((skill) => (
              <div
                key={skill.name}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-medium text-slate-200 block truncate">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-2 h-2 rounded-full ${
                          lvl <= skill.level ? 'bg-indigo-500' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1 font-mono">
                      L{skill.level}
                    </span>
                  </div>
                </div>
                {skill.inDemand && (
                  <Badge variant="warning" size="sm" className="text-[9px] py-0 px-1">
                    In-Demand
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Upskilling Pathway Milestones */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              Prescribed 6-Week Upskilling Pathway
            </h4>
            <Badge variant="success" size="sm">
              AI Tailored
            </Badge>
          </div>

          <div className="space-y-2.5">
            {roadmap.milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      m.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : m.status === 'in-progress'
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {m.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">{m.title}</h5>
                    <p className="text-[11px] text-slate-400">
                      {m.provider} • <Clock className="w-3 h-3 inline ml-1 mr-0.5" />
                      {m.duration}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    m.status === 'completed'
                      ? 'success'
                      : m.status === 'in-progress'
                      ? 'default'
                      : 'secondary'
                  }
                  size="sm"
                  className="capitalize"
                >
                  {m.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Strategic Reallocation Matches */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            Strategic Reallocation Opportunities
          </h4>
          <div className="space-y-2.5">
            {roadmap.reallocationMatches.map((match) => (
              <div
                key={match.projectName}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-white">{match.projectName}</span>
                    <Badge variant="cyan" size="sm">
                      {match.roleNeeded}
                    </Badge>
                    <Badge variant="success" size="sm">
                      {match.fitScore}% Fit Match
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-300">{match.rationale}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReallocate(match.projectName)}
                  className="text-xs shrink-0 gap-1 text-indigo-300 hover:text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                  Propose Shift
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {assignedStatus ? (
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {assignedStatus}
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Synchronized with enterprise HRIS & Learning Guilds
            </span>
          )}

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="ai" size="sm" onClick={handleAssign} className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Assign Upskilling Cohort
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
