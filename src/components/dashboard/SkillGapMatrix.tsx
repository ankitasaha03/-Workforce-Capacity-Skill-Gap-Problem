'use client';

import React, { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Layers, BarChart3, PieChart as RadarIcon, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkillMatrixItem, Department } from '@/types';

interface SkillGapMatrixProps {
  skills: SkillMatrixItem[];
  selectedDepartment: Department;
  onDepartmentSelect: (dept: Department) => void;
}

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({
  skills,
  selectedDepartment,
  onDepartmentSelect,
}) => {
  const [viewType, setViewType] = useState<'radar' | 'bar'>('bar');

  // Filter skills based on selected department
  const filteredSkills = selectedDepartment === 'All'
    ? skills
    : skills.filter((s) => s.department === selectedDepartment);

  // Radar data format (shorten skill names for neat display)
  const radarData = filteredSkills.map((s) => ({
    skill: s.skill.length > 18 ? s.skill.substring(0, 16) + '..' : s.skill,
    fullName: s.skill,
    Required: s.required,
    Available: s.available,
    Gap: s.gap,
    department: s.department,
  }));

  const totalRequired = filteredSkills.reduce((acc, curr) => acc + curr.required, 0);
  const totalAvailable = filteredSkills.reduce((acc, curr) => acc + curr.available, 0);
  const overallGap = totalRequired - totalAvailable;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>
              <Layers className="w-4 h-4 text-indigo-400" />
              Skill Gap Matrix
            </CardTitle>
            <Badge variant="danger" size="sm">
              {overallGap} Headcount Gap
            </Badge>
          </div>
          <CardDescription>
            Required vs. Currently Available skills across active engineering squads
          </CardDescription>
        </div>

        {/* View Toggle (Bar vs Radar) */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewType('bar')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewType === 'bar'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Bar Comparison
          </button>
          <button
            onClick={() => setViewType('radar')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewType === 'radar'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RadarIcon className="w-3.5 h-3.5" />
            Radar Spectrum
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        {/* Chart Container */}
        <div className="h-[280px] w-full mt-2">
          {viewType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredSkills}
                margin={{ top: 15, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="skill"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  tick={({ x, y, payload }) => {
                    const text = payload.value;
                    const truncated = text.length > 14 ? text.substring(0, 12) + '...' : text;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={12}
                          textAnchor="end"
                          fill="#94a3b8"
                          fontSize={10}
                          transform="rotate(-25)"
                        >
                          {truncated}
                        </text>
                      </g>
                    );
                  }}
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const req = payload.find((p) => p.dataKey === 'required')?.value as number || 0;
                      const avail = payload.find((p) => p.dataKey === 'available')?.value as number || 0;
                      const gap = req - avail;
                      return (
                        <div className="rounded-xl bg-slate-900/95 border border-slate-700/80 p-3 shadow-xl backdrop-blur-md text-xs">
                          <p className="font-semibold text-slate-100 mb-1">{label}</p>
                          <div className="flex items-center gap-4 text-slate-300 my-0.5">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                              Required: <strong className="text-white">{req}</strong>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                              Available: <strong className="text-white">{avail}</strong>
                            </span>
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-rose-400 font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Deficit Gap:
                            </span>
                            <span className="font-bold text-rose-400 font-mono">
                              -{gap} FTEs
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: '11px' }}
                  iconType="circle"
                  formatter={(val) => <span className="text-slate-300">{val}</span>}
                />
                <Bar
                  dataKey="required"
                  name="Required Headcount"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
                <Bar
                  dataKey="available"
                  name="Available Verified"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="skill"
                  stroke="#94a3b8"
                  tick={{ fontSize: 10, fill: '#cbd5e1' }}
                />
                <PolarRadiusAxis stroke="#475569" fontSize={9} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl bg-slate-900/95 border border-slate-700/80 p-3 shadow-xl text-xs backdrop-blur-md">
                          <p className="font-semibold text-slate-100">{data.fullName}</p>
                          <p className="text-slate-400 text-[10px] mb-1.5">{data.department}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4">
                              <span className="text-indigo-400">Required:</span>
                              <span className="font-bold text-white">{data.Required}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-emerald-400">Available:</span>
                              <span className="font-bold text-white">{data.Available}</span>
                            </div>
                            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 text-rose-400">
                              <span>Skill Shortage:</span>
                              <span className="font-bold">-{data.Gap}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Radar
                  name="Required Skills"
                  dataKey="Required"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.35}
                />
                <Radar
                  name="Available Skills"
                  dataKey="Available"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: '11px' }}
                  iconType="circle"
                  formatter={(val) => <span className="text-slate-300">{val}</span>}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bottom Insight Footer */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Highest shortage:</span>
            <span className="font-semibold text-slate-200">LLM Fine-Tuning & RAG (-18 FTEs)</span>
          </div>
          <span className="text-indigo-400 hover:underline cursor-pointer">
            Explore 4 targeted upskilling cohorts →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
