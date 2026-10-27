'use client';

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Layers,
  GitFork,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingUp,
  Brain,
  Download,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';

import { Header } from '@/components/dashboard/Header';
import { KpiMetrics } from '@/components/dashboard/KpiMetrics';
import { SkillGapMatrix } from '@/components/dashboard/SkillGapMatrix';
import { CapacityAllocationChart } from '@/components/dashboard/CapacityAllocationChart';
import { AllocationFunnel } from '@/components/dashboard/AllocationFunnel';
import { AiRecommendationsStream } from '@/components/dashboard/AiRecommendationsStream';
import { DepartmentDistribution } from '@/components/dashboard/DepartmentDistribution';
import { SimulationBanner } from '@/components/dashboard/SimulationBanner';
import { ExportAuditModal } from '@/components/dashboard/ExportAuditModal';
import { AiAssistantDrawer } from '@/components/assistant/AiAssistantDrawer';
import { EmployeeExplorer } from '@/components/workforce/EmployeeExplorer';
import { ScenarioComparisonModal } from '@/components/simulation/ScenarioComparisonModal';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

import {
  INITIAL_KPIS,
  INITIAL_SKILLS_MATRIX,
  INITIAL_CAPACITY_DATA,
  INITIAL_ALLOCATION_FUNNEL,
  INITIAL_RECOMMENDATIONS,
  INITIAL_NOTIFICATIONS,
} from '@/data/initialData';
import { MOCK_EMPLOYEES } from '@/data/mockEmployees';
import {
  Department,
  TimeRange,
  Recommendation,
  SimulationDiff,
  NotificationItem,
  KpiMetricsData,
} from '@/types';

export default function Home() {
  // Navigation & Filter State
  const [selectedEnterprise, setSelectedEnterprise] = useState('Apex Global Technologies (Enterprise)');
  const [selectedProfile, setSelectedProfile] = useState('Sarah Jenkins');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('Q3 2025');
  const [activeMainTab, setActiveMainTab] = useState<string>('dashboard');

  // Interactive Data State
  const [kpis, setKpis] = useState<Record<Department, KpiMetricsData>>(INITIAL_KPIS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeSimulation, setActiveSimulation] = useState<{
    title: string;
    diff: SimulationDiff;
    recId?: string;
  } | null>(null);

  // Modals & Panels
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [activeRecForSimulation, setActiveRecForSimulation] = useState<Recommendation | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Employee count per department
  const employeeCountByDept = useMemo(() => {
    const counts: Record<Department, number> = {
      All: MOCK_EMPLOYEES.length,
      Engineering: 0,
      'AI/ML': 0,
      'Cloud & DevOps': 0,
      'Product & Design': 0,
      'Cyber Security': 0,
    };
    MOCK_EMPLOYEES.forEach((emp) => {
      counts[emp.department] = (counts[emp.department] || 0) + 1;
    });
    return counts;
  }, []);

  // Current active department KPIs
  const currentKpi = kpis[selectedDepartment] || kpis['All'];

  // Trigger confetti for positive feedback
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#a855f7'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const showToast = (message: string) => {
    setActionSuccessToast(message);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Simulation Handlers
  const handleStartSimulation = (rec: Recommendation) => {
    setActiveRecForSimulation(rec);
    setIsScenarioModalOpen(true);
  };

  const handleApplySimulation = (title: string, diff: SimulationDiff, recId?: string) => {
    setActiveSimulation({ title, diff, recId });
    showToast(`Scenario active: "${title}"`);
  };

  const handleCommitSimulation = () => {
    if (!activeSimulation) return;
    const { diff, recId } = activeSimulation;

    // Permanently bake simulation into active department KPIs
    setKpis((prev) => {
      const current = prev[selectedDepartment];
      return {
        ...prev,
        [selectedDepartment]: {
          ...current,
          skillMatchIndex: Math.min(100, Math.round((current.skillMatchIndex + diff.skillMatchDelta) * 10) / 10),
          criticalSkillGaps: Math.max(0, current.criticalSkillGaps + diff.gapsDelta),
          projectDelayRisk: Math.max(0, Math.round((current.projectDelayRisk + diff.projectDelayRiskDelta) * 10) / 10),
          costSavings: current.costSavings + diff.costSavedDelta,
          efficiencyGain: Math.round((current.efficiencyGain + diff.efficiencyGainDelta) * 10) / 10,
        },
      };
    });

    // Mark rec as approved if originating from recommendation
    if (recId) {
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, status: 'approved' } : r))
      );
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Simulation Committed to Active Plan',
      message: `${activeSimulation.title} has been committed. Skill match increased by +${diff.skillMatchDelta}%.`,
      time: 'Just now',
      type: 'success',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setActiveSimulation(null);
    triggerCelebration();
    showToast('Plan committed! Metrics successfully updated.');
  };

  const handleExitSimulation = () => {
    setActiveSimulation(null);
    showToast('Simulation exited. Reverted to baseline metrics.');
  };

  // Recommendation actions
  const handleApproveRecommendation = (id: string) => {
    const rec = recommendations.find((r) => r.id === id);
    if (!rec) return;

    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );

    // Update KPI metrics
    setKpis((prev) => {
      const current = prev[selectedDepartment];
      return {
        ...prev,
        [selectedDepartment]: {
          ...current,
          skillMatchIndex: Math.min(100, Math.round((current.skillMatchIndex + rec.simulationDiff.skillMatchDelta) * 10) / 10),
          criticalSkillGaps: Math.max(0, current.criticalSkillGaps + rec.simulationDiff.gapsDelta),
          projectDelayRisk: Math.max(0, Math.round((current.projectDelayRisk + rec.simulationDiff.projectDelayRiskDelta) * 10) / 10),
          costSavings: current.costSavings + rec.simulationDiff.costSavedDelta,
          efficiencyGain: Math.round((current.efficiencyGain + rec.simulationDiff.efficiencyGainDelta) * 10) / 10,
        },
      };
    });

    triggerCelebration();
    showToast(`Approved: "${rec.title}"`);
  };

  const handleDismissRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'dismissed' } : r))
    );
    showToast('Recommendation dismissed.');
  };

  // Notification actions
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Alert */}
      {actionSuccessToast && (
        <div className="fixed top-20 right-6 z-50 p-3 px-4 rounded-xl bg-slate-900 border border-emerald-500/50 shadow-2xl flex items-center gap-2.5 text-xs text-white animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* 1. Header & Navigation */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEnterprise={selectedEnterprise}
        onEnterpriseChange={setSelectedEnterprise}
        selectedProfile={selectedProfile}
        onProfileChange={setSelectedProfile}
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
        onOpenAuditModal={() => setIsExportModalOpen(true)}
        onOpenSimulationModal={() => {
          setActiveRecForSimulation(null);
          setIsScenarioModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onToggleAiCopilot={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        isAiDrawerOpen={isAiDrawerOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Active Simulation Mode Banner */}
        {activeSimulation && (
          <SimulationBanner
            simulationTitle={activeSimulation.title}
            diff={activeSimulation.diff}
            onCommit={handleCommitSimulation}
            onExit={handleExitSimulation}
          />
        )}

        {/* Control Bar: Department Filters & Time Horizon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <DepartmentDistribution
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
            employeeCountByDept={employeeCountByDept}
          />

          {/* Timeframe Selector & Quick Simulation Trigger */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1.5" />
              {(['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'] as TimeRange[]).map((tr) => (
                <button
                  key={tr}
                  onClick={() => setSelectedTimeRange(tr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedTimeRange === tr
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Metric Cards (KPI Band) */}
        <KpiMetrics
          metrics={currentKpi}
          activeSimulationDiff={activeSimulation?.diff}
          onKpiClick={(key) => {
            if (key === 'skillGaps') setActiveMainTab('skills');
            if (key === 'optimization') setActiveMainTab('funnel');
          }}
        />

        {/* Navigation Tabs for Views */}
        <Tabs value={activeMainTab} defaultValue="dashboard" onValueChange={setActiveMainTab}>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <TabsList>
              <TabsTrigger value="dashboard" className="gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Executive Dashboard
              </TabsTrigger>
              <TabsTrigger value="workforce" className="gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Workforce & Skill Explorer
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {MOCK_EMPLOYEES.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Skill Gap Matrix
              </TabsTrigger>
              <TabsTrigger value="funnel" className="gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                Strategic Allocation Funnel
              </TabsTrigger>
            </TabsList>

            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="secondary" size="sm" className="font-mono text-[11px]">
                Showing: {selectedDepartment}
              </Badge>
              <Button
                variant="ai"
                size="sm"
                onClick={() => setIsAiDrawerOpen(true)}
                className="gap-1 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask Copilot
              </Button>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          <TabsContent value="dashboard" className="space-y-6 mt-4">
            {/* Visualizations Row 1: Skill Gap Matrix & Project Capacity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkillGapMatrix
                skills={INITIAL_SKILLS_MATRIX}
                selectedDepartment={selectedDepartment}
                onDepartmentSelect={setSelectedDepartment}
              />
              <CapacityAllocationChart data={INITIAL_CAPACITY_DATA} />
            </div>

            {/* Strategic Allocation Funnel */}
            <AllocationFunnel
              funnelData={INITIAL_ALLOCATION_FUNNEL}
              onSelectCategory={(cat) => {
                showToast(`Filtering recommendations by ${cat}`);
              }}
            />

            {/* Actionable AI Recommendations Stream */}
            <AiRecommendationsStream
              recommendations={recommendations}
              onSimulate={handleStartSimulation}
              onApprove={handleApproveRecommendation}
              onDismiss={handleDismissRecommendation}
              activeSimulationId={activeSimulation?.recId}
            />

            {/* Employee Explorer Teaser */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Workforce Talent Roster Preview
                  </h3>
                  <Badge variant="purple" size="sm">
                    {MOCK_EMPLOYEES.length} Active Profiles
                  </Badge>
                </div>
                <button
                  onClick={() => setActiveMainTab('workforce')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  Open Full Talent Explorer →
                </button>
              </div>
              <EmployeeExplorer
                employees={MOCK_EMPLOYEES}
                selectedDepartment={selectedDepartment}
                searchQuery={searchQuery}
              />
            </div>
          </TabsContent>

          {/* TAB 2: WORKFORCE & EMPLOYEE SKILL EXPLORER */}
          <TabsContent value="workforce" className="mt-4">
            <EmployeeExplorer
              employees={MOCK_EMPLOYEES}
              selectedDepartment={selectedDepartment}
              searchQuery={searchQuery}
            />
          </TabsContent>

          {/* TAB 3: SKILL GAP MATRIX DEEP DIVE */}
          <TabsContent value="skills" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SkillGapMatrix
                  skills={INITIAL_SKILLS_MATRIX}
                  selectedDepartment={selectedDepartment}
                  onDepartmentSelect={setSelectedDepartment}
                />
              </div>
              <Card className="h-full flex flex-col justify-between">
                <div className="p-5 border-b border-slate-800">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    Critical In-Demand Taxonomy
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Top 5 competencies causing project delivery blockage
                  </p>
                </div>
                <div className="p-5 space-y-3.5 flex-1">
                  {INITIAL_SKILLS_MATRIX.slice(0, 5).map((item) => (
                    <div
                      key={item.skill}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">
                          {item.skill}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.department} • Req: {item.required} FTEs
                        </span>
                      </div>
                      <Badge variant="danger" size="sm" className="font-mono">
                        -{item.gap} Deficit
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-900/60">
                  <Button
                    variant="ai"
                    size="sm"
                    onClick={() => {
                      setIsAiDrawerOpen(true);
                    }}
                    className="w-full text-xs gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Upskilling Pathways for Top Gaps
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 4: STRATEGIC ALLOCATION FUNNEL */}
          <TabsContent value="funnel" className="mt-4 space-y-6">
            <AllocationFunnel
              funnelData={INITIAL_ALLOCATION_FUNNEL}
              onSelectCategory={(cat) => showToast(`Selected: ${cat}`)}
            />
            <AiRecommendationsStream
              recommendations={recommendations}
              onSimulate={handleStartSimulation}
              onApprove={handleApproveRecommendation}
              onDismiss={handleDismissRecommendation}
              activeSimulationId={activeSimulation?.recId}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Embedded AI Assistant Chatbot Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        onTriggerSimulation={(title, diff) => {
          handleApplySimulation(title, diff);
          setIsAiDrawerOpen(false);
        }}
      />

      {/* Scenario Planning Simulator Modal */}
      <ScenarioComparisonModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        currentKpis={currentKpi}
        activeRec={activeRecForSimulation}
        onApplySimulation={(title, diff) => {
          handleApplySimulation(title, diff, activeRecForSimulation?.id);
        }}
      />

      {/* Export Executive Brief Modal */}
      <ExportAuditModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        metrics={currentKpi}
        enterpriseName={selectedEnterprise}
        department={selectedDepartment}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">WorkforceIQ Intelligence Platform</span>
            <span>• Enterprise Capacity & Skill Gap Engine</span>
          </div>
          <p>© 2026 WorkforceIQ Analytics. Real-time predictive resource allocation.</p>
        </div>
      </footer>
    </div>
  );
}
