'use client';

import React, { useState } from 'react';
import {
  Brain,
  Search,
  Building2,
  ChevronDown,
  Sparkles,
  Download,
  PlayCircle,
  CheckCircle2,
  Cpu,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { NotificationItem } from '@/types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEnterprise: string;
  onEnterpriseChange: (enterprise: string) => void;
  selectedProfile: string;
  onProfileChange: (profile: string) => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onClearNotifications: () => void;
  onOpenAuditModal: () => void;
  onOpenSimulationModal: () => void;
  onOpenExportModal: () => void;
  onToggleAiCopilot: () => void;
  isAiDrawerOpen: boolean;
}

const ENTERPRISES = [
  'Apex Global Technologies (Enterprise)',
  'FinTech Next Cloud Division',
  'HealthBio Systems AI Unit',
  'Quantum Robotics Corp',
];

const PROFILES = [
  { name: 'Sarah Jenkins', role: 'VP, Workforce Planning & Talent', avatar: 'SJ' },
  { name: 'Marcus Vance', role: 'Chief People & Culture Officer', avatar: 'MV' },
  { name: 'Elena Rostova', role: 'VP, Engineering & Infrastructure', avatar: 'ER' },
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedEnterprise,
  onEnterpriseChange,
  selectedProfile,
  onProfileChange,
  notifications,
  onMarkAllNotificationsRead,
  onClearNotifications,
  onOpenAuditModal,
  onOpenSimulationModal,
  onOpenExportModal,
  onToggleAiCopilot,
  isAiDrawerOpen,
}) => {
  const [enterpriseDropdown, setEnterpriseDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const currentProfileObj = PROFILES.find((p) => p.name === selectedProfile) || PROFILES[0];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 min-w-max">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Brain className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white flex items-center">
                  Workforce<span className="text-indigo-400">IQ</span>
                </span>
                <Badge variant="purple" size="sm" className="hidden sm:inline-flex text-[10px] py-0 px-1.5 font-mono">
                  v3.4 AI
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden md:block">
                Workforce Capacity & Skill Gap Intelligence
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search employees, skills (e.g. PyTorch, Rust), roles, or projects..."
                className="w-full h-9 pl-9 pr-4 text-xs bg-slate-900/90 text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Enterprise Selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setEnterpriseDropdown(!enterpriseDropdown)}
                className="h-9 px-3 text-xs bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 rounded-xl border border-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="max-w-[130px] truncate">{selectedEnterprise}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {enterpriseDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Active Enterprise
                  </div>
                  {ENTERPRISES.map((ent) => (
                    <button
                      key={ent}
                      onClick={() => {
                        onEnterpriseChange(ent);
                        setEnterpriseDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                        selectedEnterprise === ent
                          ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{ent}</span>
                      {selectedEnterprise === ent && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Copilot Quick Launcher Button */}
            <Button
              variant="ai"
              size="sm"
              onClick={onToggleAiCopilot}
              className="relative gap-1.5 shadow-indigo-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="hidden sm:inline">AI Copilot</span>
              {isAiDrawerOpen && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </Button>

            {/* Quick Actions (Simulate, Export) */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSimulationModal}
              className="hidden xl:inline-flex gap-1.5 text-slate-300 hover:text-white"
            >
              <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
              Simulate
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenExportModal}
              className="hidden 2xl:inline-flex gap-1.5 text-slate-300 hover:text-white"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export
            </Button>

            {/* Notification Center */}
            <NotificationCenter
              notifications={notifications}
              onMarkAllAsRead={onMarkAllNotificationsRead}
              onClearNotifications={onClearNotifications}
            />

            {/* User Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-white/10">
                  {currentProfileObj.avatar}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentProfileObj.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                    {currentProfileObj.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  {PROFILES.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        onProfileChange(p.name);
                        setProfileDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center gap-2.5 ${
                        selectedProfile === p.name
                          ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-6 h-6 rounded bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-200 shrink-0">
                        {p.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.role}</div>
                      </div>
                    </button>
                  ))}
                  <div className="mt-1 pt-1 border-t border-slate-800 px-2 py-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Role: Executive Planner</span>
                    <Badge variant="cyan" size="sm">Admin</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search skills, roles, or employees..."
              className="w-full h-9 pl-9 pr-4 text-xs bg-slate-900 text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/80"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
