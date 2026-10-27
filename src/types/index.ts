export type Department =
  | 'All'
  | 'Engineering'
  | 'AI/ML'
  | 'Cloud & DevOps'
  | 'Product & Design'
  | 'Cyber Security';

export type TimeRange = 'Q1 2025' | 'Q2 2025' | 'Q3 2025' | 'Q4 2025' | 'Full Year 2025';

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type RecommendationType = 'reallocation' | 'upskilling' | 'hiring';

export interface SimulationDiff {
  skillMatchDelta: number; // e.g. +6.7
  gapsDelta: number; // e.g. -7
  projectDelayRiskDelta: number; // e.g. -14.0
  costSavedDelta: number; // e.g. +420000
  efficiencyGainDelta: number; // e.g. +5.2
  details: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: RecommendationType;
  urgency: RiskLevel;
  department: Department;
  impactMetric: string;
  costSavings: number;
  timeline: string;
  affectedRoles: string[];
  status: 'pending' | 'approved' | 'simulating' | 'dismissed';
  simulationDiff: SimulationDiff;
}

export interface KpiMetricsData {
  skillMatchIndex: number;
  skillMatchTrend: number;
  criticalSkillGaps: number;
  gapBreakdown: { high: number; medium: number; low: number };
  projectDelayRisk: number;
  projectDelayTrend: number;
  costSavings: number;
  efficiencyGain: number;
}

export interface SkillMatrixItem {
  skill: string;
  department: Department;
  required: number;
  available: number;
  gap: number;
  urgency: RiskLevel;
}

export interface CapacityQuarterData {
  quarter: string;
  totalCapacity: number; // FTE story points or FTE count
  demand: number;
  bottleneckDeficit: number;
  allocationRate: number;
}

export interface AllocationFunnelItem {
  category: string;
  count: number;
  percentage: number;
  color: string;
  costEstimate: string;
  description: string;
  statusTag: string;
}

export interface EmployeeSkill {
  name: string;
  level: number; // 1 - 5
  verified: boolean;
  inDemand?: boolean;
}

export interface EmployeeRoadmap {
  targetRole: string;
  currentReadiness: number; // 0-100%
  primaryGap: string;
  milestones: {
    id: string;
    title: string;
    duration: string;
    type: 'course' | 'cert' | 'squad-project';
    provider: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }[];
  reallocationMatches: {
    projectName: string;
    roleNeeded: string;
    fitScore: number;
    urgency: RiskLevel;
    rationale: string;
  }[];
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: Department;
  email: string;
  utilization: number; // 0 - 120%
  availabilityHours: number;
  growthPotential: number; // 0 - 100
  riskStatus: 'Optimal' | 'High Availability' | 'Near Capacity' | 'Burnout Risk';
  skills: EmployeeSkill[];
  currentProject: string;
  experienceYears: number;
  location: string;
  roadmap: EmployeeRoadmap;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  simulationData?: {
    title: string;
    diff: SimulationDiff;
    recommendationId?: string;
  };
  structuredOutput?: {
    type: 'kpi_insight' | 'job_description' | 'scenario_summary';
    title?: string;
    points?: string[];
    actionLabel?: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info' | 'recommendation';
  read: boolean;
  actionUrl?: string;
}
