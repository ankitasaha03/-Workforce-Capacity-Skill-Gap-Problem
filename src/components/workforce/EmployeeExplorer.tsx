'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Employee, Department } from '@/types';
import { EmployeeRoadmapModal } from './EmployeeRoadmapModal';

interface EmployeeExplorerProps {
  employees: Employee[];
  selectedDepartment: Department;
  searchQuery: string;
}

export const EmployeeExplorer: React.FC<EmployeeExplorerProps> = ({
  employees,
  selectedDepartment,
  searchQuery,
}) => {
  const [internalSearch, setInternalSearch] = useState('');
  const [utilizationFilter, setUtilizationFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [sortField, setSortField] = useState<'name' | 'utilization' | 'growth'>('growth');
  const [sortAsc, setSortAsc] = useState(false);

  const query = searchQuery || internalSearch;

  // Filter employees
  const filtered = employees.filter((emp) => {
    // Dept filter
    if (selectedDepartment !== 'All' && emp.department !== selectedDepartment) {
      return false;
    }
    // Utilization filter
    if (utilizationFilter !== 'all') {
      if (utilizationFilter === 'burnout' && emp.utilization < 95) return false;
      if (utilizationFilter === 'available' && emp.utilization > 75) return false;
      if (utilizationFilter === 'optimal' && (emp.utilization < 75 || emp.utilization > 95)) return false;
    }
    // Search query
    if (query) {
      const q = query.toLowerCase();
      const matchName = emp.name.toLowerCase().includes(q);
      const matchRole = emp.role.toLowerCase().includes(q);
      const matchDept = emp.department.toLowerCase().includes(q);
      const matchSkill = emp.skills.some((s) => s.name.toLowerCase().includes(q));
      const matchProject = emp.currentProject.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchDept && !matchSkill && !matchProject) {
        return false;
      }
    }
    return true;
  });

  // Sort employees
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortField === 'utilization') {
      return sortAsc ? a.utilization - b.utilization : b.utilization - a.utilization;
    }
    // growth
    return sortAsc ? a.growthPotential - b.growthPotential : b.growthPotential - a.growthPotential;
  });

  const getRiskStatusBadge = (utilization: number) => {
    if (utilization > 95) {
      return (
        <Badge variant="danger" size="sm" className="gap-1">
          <AlertCircle className="w-3 h-3" /> Burnout Risk
        </Badge>
      );
    }
    if (utilization < 75) {
      return (
        <Badge variant="cyan" size="sm" className="gap-1">
          <Sparkles className="w-3 h-3" /> High Availability
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="sm" className="gap-1">
        <CheckCircle2 className="w-3 h-3" /> Optimal
      </Badge>
    );
  };

  const getProgressVariant = (utilization: number) => {
    if (utilization > 95) return 'danger';
    if (utilization < 75) return 'default';
    return 'success';
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>
                <Users className="w-4 h-4 text-indigo-400" />
                Workforce & Employee Skill Explorer
              </CardTitle>
              <Badge variant="secondary" size="sm">
                {sorted.length} Profiles Found
              </Badge>
            </div>
            <CardDescription>
              Verified technical proficiencies, current squad utilization, and growth readiness
            </CardDescription>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                placeholder="Filter table..."
                className="h-8 pl-8 pr-3 text-xs bg-slate-900 text-slate-200 placeholder-slate-500 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 w-36 sm:w-48"
              />
            </div>

            {/* Utilization Filter */}
            <select
              value={utilizationFilter}
              onChange={(e) => setUtilizationFilter(e.target.value)}
              className="h-8 px-2.5 text-xs bg-slate-900 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Utilization</option>
              <option value="available">High Free Capacity (&lt;75%)</option>
              <option value="optimal">Optimal (75% - 95%)</option>
              <option value="burnout">Burnout Risk (&gt;95%)</option>
            </select>

            {/* Sort toggle */}
            <button
              onClick={() => {
                if (sortField === 'growth') {
                  setSortField('utilization');
                } else if (sortField === 'utilization') {
                  setSortField('name');
                } else {
                  setSortField('growth');
                }
              }}
              className="h-8 px-2.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Change sort field"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              Sort: <span className="capitalize font-semibold text-white">{sortField}</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Current Role & Project</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Verified Skill Badges</th>
                <th className="py-3 px-4">Utilization</th>
                <th className="py-3 px-4">Growth Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No workforce profiles matched your search criteria.
                  </td>
                </tr>
              ) : (
                sorted.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Employee Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700/80 group-hover:border-indigo-500/80 transition-colors"
                        />
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Project */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{emp.role}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]" title={emp.currentProject}>
                        {emp.currentProject}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" size="sm">
                        {emp.department}
                      </Badge>
                    </td>

                    {/* Skills */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {emp.skills.slice(0, 3).map((s) => (
                          <span
                            key={s.name}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                              s.inDemand
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <span>{s.name}</span>
                            <span className="text-[9px] text-indigo-400 font-bold">★{s.level}</span>
                          </span>
                        ))}
                        {emp.skills.length > 3 && (
                          <span className="text-[10px] text-slate-500 self-center">
                            +{emp.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Utilization */}
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-slate-200">{emp.utilization}%</span>
                        {getRiskStatusBadge(emp.utilization)}
                      </div>
                      <Progress
                        value={emp.utilization}
                        variant={getProgressVariant(emp.utilization)}
                        className="h-1.5"
                      />
                    </td>

                    {/* Growth Potential */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-sm">
                          {emp.growthPotential}
                        </span>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        Target: {emp.roadmap.targetRole.split(' ')[0]}...
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(emp);
                        }}
                        className="text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                      >
                        View Roadmap
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Slide-over Roadmap Modal */}
      <EmployeeRoadmapModal
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </>
  );
};
