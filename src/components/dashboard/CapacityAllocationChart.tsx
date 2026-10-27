'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Activity, BarChart2, AreaChart as AreaIcon, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CapacityQuarterData } from '@/types';

interface CapacityAllocationChartProps {
  data: CapacityQuarterData[];
}

export const CapacityAllocationChart: React.FC<CapacityAllocationChartProps> = ({ data }) => {
  const [chartMode, setChartMode] = useState<'area' | 'bar'>('area');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>
              <Activity className="w-4 h-4 text-emerald-400" />
              Project Capacity vs. Demand
            </CardTitle>
            <Badge variant="warning" size="sm">
              Q3 Bottleneck Peak
            </Badge>
          </div>
          <CardDescription>
            Quarterly FTE Capacity vs. Pipeline Demand & Skill-Shortage Deficits
          </CardDescription>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setChartMode('area')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chartMode === 'area'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AreaIcon className="w-3.5 h-3.5" />
            Area Stream
          </button>
          <button
            onClick={() => setChartMode('bar')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chartMode === 'bar'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Quarter Bars
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <div className="h-[280px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'area' ? (
              <AreaChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="capacityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="bottleneckGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="quarter" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const capacity = payload.find((p) => p.dataKey === 'totalCapacity')?.value as number || 0;
                      const demand = payload.find((p) => p.dataKey === 'demand')?.value as number || 0;
                      const bottleneck = payload.find((p) => p.dataKey === 'bottleneckDeficit')?.value as number || 0;
                      const overload = demand > capacity;

                      return (
                        <div className="rounded-xl bg-slate-900/95 border border-slate-700/80 p-3 shadow-xl backdrop-blur-md text-xs">
                          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5 mb-2">
                            <span className="font-semibold text-slate-100">{label} Forecast</span>
                            {overload && (
                              <Badge variant="danger" size="sm">
                                Over Capacity
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-6">
                              <span className="text-emerald-400">Total Available Capacity:</span>
                              <strong className="text-white font-mono">{capacity} FTE</strong>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span className="text-indigo-400">Project Demand:</span>
                              <strong className="text-white font-mono">{demand} FTE</strong>
                            </div>
                            <div className="flex justify-between gap-6 pt-1 border-t border-slate-800/80 text-rose-400">
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Skill-Deficit Bottleneck:
                              </span>
                              <strong className="font-mono">-{bottleneck} FTE</strong>
                            </div>
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
                <Area
                  type="monotone"
                  dataKey="demand"
                  name="Project Pipeline Demand"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#demandGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="totalCapacity"
                  name="Active Workforce Capacity"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#capacityGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="bottleneckDeficit"
                  name="Skill Deficit Bottleneck"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#bottleneckGrad)"
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="quarter" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl bg-slate-900/95 border border-slate-700/80 p-3 shadow-xl backdrop-blur-md text-xs">
                          <p className="font-semibold text-slate-100 mb-1.5">{label}</p>
                          {payload.map((item) => (
                            <div key={item.name} className="flex justify-between gap-4 py-0.5">
                              <span style={{ color: item.color }}>{item.name}:</span>
                              <span className="font-bold text-white font-mono">{item.value} FTE</span>
                            </div>
                          ))}
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
                  dataKey="totalCapacity"
                  name="Workforce Capacity"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="demand"
                  name="Pipeline Demand"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="bottleneckDeficit"
                  name="Bottleneck Gap"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Highlight Banner */}
        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400" />
            <span>
              <strong>Q3 Crunch Alert:</strong> 75 FTE deficit projected due to GenAI & Platform transition.
            </span>
          </div>
          <span className="text-amber-400 font-semibold cursor-pointer hover:underline text-[11px]">
            Simulate Resolution →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
