export type CourseStatus = "planned" | "in_progress" | "completed" | "cancelled" | "waitlisted" | "failed";

export interface CoveredSchool {
  /** Human-readable name; must match `requiredBy` entries exactly. */
  name: string;
  /** Institution row UUID; null when the AI couldn't be resolved to a DB row. */
  institutionId: string | null;
  /** 0–100 fit score. */
  fitScore: number;
  articulatedUnits: number;
  totalRequiredUnits: number;
  /** Optional short badges shown under the school name. */
  highlights?: string[];
}

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
  /**
   * Names of covered schools that require or accept this course.
   * MUST be a subset of TransferPlan.coveredSchools[].name. When omitted
   * the UI treats the course as universal across every covered school.
   */
  requiredBy?: string[];
}

export interface PlanSemester {
  number: number;
  label: string;
  courses: PlanCourse[];
  totalUnits: number;
}

export interface TransferPlan {
  ccName: string;
  /**
   * Top-fit / primary school name. When `coveredSchools.length > 1`, this
   * equals coveredSchools[0].name. For legacy single-school plans it is
   * simply the target university name.
   */
  targetUniversity: string;
  targetMajor: string;
  /**
   * Non-empty when this is a multi-school unified plan. Empty/undefined
   * for single-school plans (renders without asterisks or legend).
   */
  coveredSchools?: CoveredSchool[];
  semesters: PlanSemester[];
  totalUnits: number;
}

export interface NoDataResponse {
  isNoData: true;
  message: string;
}

export type ParsedPlan = TransferPlan | NoDataResponse;
