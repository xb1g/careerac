export type CourseStatus = "planned" | "in_progress" | "completed" | "cancelled" | "waitlisted" | "failed";

export interface PlanCourse {
  code: string;
  title: string;
  units: number;
  transferEquivalency?: string;
  prerequisites?: string[];
  notes?: string;
  /** Course status for tracking progress. Defaults to 'planned'. */
  status?: CourseStatus;
  /** Database ID for the plan_course record (used for status updates) */
  id?: string;
  /** Semester number this course belongs to */
  semesterNumber?: number;
  /** Links to the course code this is an alternative for (recovery) */
  alternative_for?: string;
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

export interface UniversityFit {
  universityName: string;
  fitScore: number;
  articulatedUnits: number;
  totalRequiredUnits: number;
  completedPrereqs: number;
  totalPrereqs: number;
  remainingSemesters: number;
  plan: TransferPlan;
  highlights: string[];
}

export interface MultiUniversityPlan {
  isMultiUniversity: true;
  studentCC: string;
  major: string;
  maxCreditsPerSemester: number;
  transcriptSummary: {
    completedCourses: number;
    totalUnits: number;
    gpa?: number;
  };
  universities: UniversityFit[];
}

export type ParsedPlan = TransferPlan | NoDataResponse | MultiUniversityPlan;
