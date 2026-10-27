'use client';

import React from 'react';
import { Department } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Cpu, Cloud, Code, Palette, Shield, Sparkles } from 'lucide-react';

interface DepartmentDistributionProps {
  selectedDepartment: Department;
  onSelectDepartment: (dept: Department) => void;
  employeeCountByDept: Record<Department, number>;
}

export const DepartmentDistribution: React.FC<DepartmentDistributionProps> = ({
  selectedDepartment,
  onSelectDepartment,
  employeeCountByDept,
}) => {
  const departments: { key: Department; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'All', label: 'All Departments', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'indigo' },
    { key: 'Engineering', label: 'Engineering', icon: <Code className="w-3.5 h-3.5" />, color: 'blue' },
    { key: 'AI/ML', label: 'AI & Machine Learning', icon: <Cpu className="w-3.5 h-3.5" />, color: 'purple' },
    { key: 'Cloud & DevOps', label: 'Cloud & DevOps', icon: <Cloud className="w-3.5 h-3.5" />, color: 'cyan' },
    { key: 'Product & Design', label: 'Product & UX', icon: <Palette className="w-3.5 h-3.5" />, color: 'emerald' },
    { key: 'Cyber Security', label: 'Cyber Security', icon: <Shield className="w-3.5 h-3.5" />, color: 'rose' },
  ];

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {departments.map((dept) => {
          const isSelected = selectedDepartment === dept.key;
          const count = employeeCountByDept[dept.key] || 0;

          return (
            <button
              key={dept.key}
              onClick={() => onSelectDepartment(dept.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25 ring-1 ring-white/10'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                {dept.icon}
              </span>
              <span>{dept.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-indigo-700/80 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count} FTEs
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
