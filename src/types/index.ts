export type LevelId = "starter" | "explorer" | "builder" | "maker" | "pro";
export type Language = "en" | "hi";
export type ProviderId = "udemy" | "coursera" | "linkedin" | "simplilearn" | "futureskills" | "indiaai";
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type AiExperience = "none" | "beginner" | "intermediate" | "advanced";
export type OccupationStatus =
  | "school_student"
  | "college_student"
  | "graduate_job_seeker"
  | "working_professional"
  | "entrepreneur"
  | "educator"
  | "other";
export type ProfileSuitability = OccupationStatus | "all";
export type AgeEligibility = "youth_eligible" | "general";

export interface AccessibilityPreferences {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

export interface User {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  state: string;
  city: string;
  education: string;
  occupationStatus: OccupationStatus;
  field: string;
  aiExperience: AiExperience;
  goals: string[];
  interests: string[];
  preferredLanguage: Language;
  accessibilityPreferences: AccessibilityPreferences;
  ageEligibility: AgeEligibility;
  currentLevel: LevelId | null;
  maskedAadhaar: string;
  avatarHue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  levels: LevelId[];
  evidenceTypes: EvidenceType[];
}

export type CourseFormat = "Video" | "Self-paced" | "Live cohort" | "Project-based" | "Text + labs";
export type PriceType = "free" | "paid" | "subscription" | "free_audit";
export type VerificationType = "mcq" | "scenario" | "practical" | "mixed";
export type EvidenceType = "url" | "repository" | "demo" | "screenshot" | "video" | "project";
export type CourseStatus = "draft" | "published" | "unpublished";
export type UrlStatus = "verified" | "provider-search";

export interface Course {
  id: string;
  provider: ProviderId;
  title: string;
  url: string;
  thumbnail: { from: string; to: string; icon: string };
  description: string;
  instructor: string;
  level: LevelId;
  skills: string[];
  categories: string[];
  domains: string[];
  duration: string;
  durationHours: number;
  sections: { title: string; lessons: number }[];
  languages: string[];
  price: number;
  priceType: PriceType;
  format: CourseFormat;
  hasProject: boolean;
  targetProfiles: ProfileSuitability[];
  ageRange: [number, number];
  prerequisites: string[];
  learningOutcomes: string[];
  buildOutcomes: string[];
  verificationType: VerificationType;
  evidenceTypes: EvidenceType[];
  verificationAssessmentId: string | null;
  featured: boolean;
  status: CourseStatus;
  sourceMetadata: { urlStatus: UrlStatus; curatedOn: string; note: string };
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skill: string;
  topic: string;
  domain: string;
  difficulty: Difficulty;
  ageSuitability: [number, number];
  profileSuitability: ProfileSuitability[];
  levelMapping: LevelId;
}

export interface PracticalTask {
  brief: string;
  requiredEvidence: EvidenceType[];
  rubric: { criterion: string; weight: number; description: string }[];
}

export interface Assessment {
  id: string;
  type: "baseline" | "course";
  courseId: string | null;
  title: string;
  questions: Question[];
  scenarios: { id: string; prompt: string; options: string[]; correctAnswer: number; explanation: string }[];
  practical: PracticalTask | null;
  difficulty: Difficulty;
  skills: string[];
  passMark: number;
  generatedBy: "human" | "ai";
  reviewStatus: "draft" | "in_review" | "approved";
  publishedAt: string | null;
}

export interface BaselineAnswer {
  questionId: string;
  selected: number;
  correct: boolean;
  skill: string;
  difficulty: Difficulty;
}

export interface BaselineSession {
  id: string;
  userId: string;
  answers: BaselineAnswer[];
  estimate: number;
  confidence: number;
  currentQuestionId: string | null;
  done: boolean;
  startedAt: string;
}

export interface AssessmentResult {
  level: LevelId;
  nextLevel: LevelId | null;
  confidence: number;
  score: number;
  questionsAnswered: number;
  strengths: string[];
  growthAreas: string[];
  skillsDetected: { skillId: string; strength: number }[];
  completedAt: string;
}

export interface PathStep {
  order: number;
  title: string;
  why: string;
  skillIds: string[];
  courseId: string | null;
  status: "done" | "current" | "upcoming";
}

export interface LearningPath {
  currentLevel: LevelId;
  targetLevel: LevelId;
  steps: PathStep[];
}

export type EnrollmentState =
  | "not_started"
  | "in_progress"
  | "declared_complete"
  | "assessment_ready"
  | "passed"
  | "evidence_required"
  | "evidence_submitted"
  | "under_review"
  | "verified"
  | "not_verified"
  | "credential_issued";

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  state: EnrollmentState;
  progress: number;
  startedAt: string;
  declaredAt: string | null;
  attempts: { at: string; score: number; passed: boolean }[];
  evidenceIds: string[];
  credentialId: string | null;
}

export interface Evidence {
  id: string;
  userId: string;
  courseId: string;
  type: EvidenceType;
  url: string;
  note: string;
  submittedAt: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  reviewerNote: string | null;
  rubricScores: Record<string, number> | null;
}

export interface Credential {
  id: string;
  userId: string;
  courseId: string;
  skillId: string;
  type: "certificate" | "badge";
  level: LevelId;
  issuedAt: string;
  verificationStatus: "verified" | "revoked" | "pending";
  credentialNumber: string;
  evidenceIds: string[];
  basis: string;
}

export type ProjectStatus = "draft" | "submitted" | "under_review" | "verified" | "featured";

export interface Project {
  id: string;
  userId: string;
  title: string;
  problem: string;
  solution: string;
  description: string;
  aiUsed: string;
  category: string;
  skills: string[];
  liveUrl: string;
  repositoryUrl: string;
  demoUrl: string;
  screenshots: string[];
  evidence: string[];
  impact: string;
  status: ProjectStatus;
  recognitionCategory: string | null;
  reviewerNotes?: string;
  createdAt: string;
}

export interface RecognitionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "draft" | "published" | "archived";
  year: number;
}

export interface Recognition {
  id: string;
  category: string;
  year: number;
  rank: number;
  userId: string;
  projectId: string;
  rubricScore: number;
  rubricBreakdown: Record<string, number>;
  status: "shortlisted" | "published" | "unpublished" | "archived";
  reviewerNotes: string;
}

export interface RubricCriterion {
  id: string;
  label: string;
  weight: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  kind: "credential" | "assessment" | "course" | "project" | "recognition" | "system";
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
}

export interface PassportData {
  user: User;
  level: LevelId | null;
  nextSkill: Skill | null;
  verifiedSkills: { skill: Skill; level: LevelId; date: string; credentialId: string; status: string }[];
  credentials: Credential[];
  projects: Project[];
  recognitions: (Recognition & { projectTitle: string; categoryName: string })[];
  timeline: { id: string; at: string; title: string; kind: string }[];
  learning: { courseId: string; title: string; progress: number; state: EnrollmentState }[];
}

export interface CourseAnalysis {
  summary: string;
  suggestedLevel: LevelId;
  skills: string[];
  categories: string[];
  domains: string[];
  audience: ProfileSuitability[];
  ageRange: [number, number];
  prerequisites: string[];
  learningOutcomes: string[];
  assessmentApproach: string;
  practicalVerification: string;
  evidenceRequirements: EvidenceType[];
  verificationType: VerificationType;
  confidence: number;
}

export interface AnalyticsData {
  totals: Record<string, number>;
  levelDistribution: { level: LevelId; count: number }[];
  stateDistribution: { state: string; count: number }[];
  ageDistribution: { band: string; count: number }[];
  skillDemand: { skill: string; count: number }[];
  providerDemand: { provider: ProviderId; opens: number }[];
  funnel: { stage: string; count: number }[];
  weekly: { week: string; registrations: number; verifications: number }[];
}
