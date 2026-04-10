export interface PlanCourse {
  code: string;
  title: string;
  units: number;
  transferEquivalency?: string;
  prerequisites?: string[];
  notes?: string;
}

export interface PlanSemester {
  number: number;
  label: string;
  courses: PlanCourse[];
  totalUnits: number;
}

export interface TransferPlan {
  ccName: string;
  targetUniversity: string;
  targetMajor: string;
  semesters: PlanSemester[];
  totalUnits: number;
}

export interface NoDataResponse {
  isNoData: true;
  message: string;
}

export type ParsedPlan = TransferPlan | NoDataResponse;
