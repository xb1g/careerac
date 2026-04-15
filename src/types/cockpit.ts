export interface CockpitTargetSchool {
  planId: string;
  title: string;
  schoolName: string;
  targetMajor: string;
  status: string;
  majorPrepCompleted: number;
  majorPrepRequired: number;
  majorPrepCompletionPercent: number;
  daysUntilDeadline: number | null;
  nextDeadlineLabel: string;
  nextDeadlineDate: string | null;
}

export interface CockpitProgressMetric {
  completed: number;
  required: number;
  completionPercent: number;
}

export interface CockpitGpaMetric {
  current: number | null;
  low: number;
  high: number;
  status: "below" | "within" | "above" | "unknown";
}

export interface CockpitDeadline {
  id: string;
  planId: string;
  title: string;
  schoolName: string;
  date: string;
  daysRemaining: number;
  kind: "tag" | "application" | "documents";
}

export interface CockpitRiskAlert {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  planId?: string;
}

export interface CockpitAction {
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface CockpitQuickStats {
  currentGpa: number | null;
  unitsCompleted: number;
  unitsRemaining: number;
  estimatedGraduation: string;
}

export interface CockpitData {
  targetSchools: CockpitTargetSchool[];
  requirementsProgress: {
    courses: CockpitProgressMetric;
    ge: CockpitProgressMetric;
    majorPrep: CockpitProgressMetric;
    gpa: CockpitGpaMetric;
  };
  upcomingDeadlines: CockpitDeadline[];
  riskAlerts: CockpitRiskAlert[];
  nextBestAction: CockpitAction | null;
  quickStats: CockpitQuickStats;
  meta: {
    lastUpdated: string;
    planCount: number;
    alertCount: number;
  };
}
