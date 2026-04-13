export interface TranscriptCourse {
  code: string;
  title: string;
  units: number;
  grade: string;
  status: "completed" | "in_progress" | "withdrawn";
  semester: string;
}

export interface TranscriptData {
  institution: string;
  courses: TranscriptCourse[];
  totalUnitsCompleted: number;
  totalUnitsInProgress: number;
  gpa?: number;
  major?: string;
}
