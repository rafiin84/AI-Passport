import { COURSES } from "@/mocks/courses";
import { USERS, DEMO_USER_ID } from "@/mocks/users";
import { PROJECTS } from "@/mocks/projects";
import { RECOGNITIONS, CATEGORIES, RUBRIC } from "@/mocks/recognition";
import { SEED_CREDENTIALS, SEED_ENROLLMENTS, SEED_EVIDENCE, SEED_NOTIFICATIONS } from "@/mocks/seed";
import { VERIFICATION_ASSESSMENTS } from "@/mocks/assessments/verification";
import type { AppNotification, Assessment, AssessmentResult, BaselineSession, Course, Credential, Enrollment, Evidence, Project, Recognition, RecognitionCategory, RubricCriterion, User } from "@/types";

/** In-memory "server" state, persisted to localStorage so the prototype survives reloads. Replace with a real backend later. */
export interface DbState {
  version: number;
  currentUserId: string | null;
  users: User[];
  courses: Course[];
  assessments: Assessment[];
  enrollments: Enrollment[];
  evidence: Evidence[];
  credentials: Credential[];
  projects: Project[];
  categories: RecognitionCategory[];
  recognitions: Recognition[];
  rubric: RubricCriterion[];
  notifications: AppNotification[];
  baselineSessions: BaselineSession[];
  baselineResults: Record<string, AssessmentResult>;
  courseOpens: Record<string, number>;
  feedback: { at: string; message: string; email?: string }[];
}

const KEY = "ai-passport-db-v1";
const VERSION = 1;

function seed(): DbState {
  const clone = <T,>(v: T): T => structuredClone(v);
  return {
    version: VERSION, currentUserId: null, users: clone(USERS), courses: clone(COURSES), assessments: clone(VERIFICATION_ASSESSMENTS), enrollments: clone(SEED_ENROLLMENTS),
    evidence: clone(SEED_EVIDENCE), credentials: clone(SEED_CREDENTIALS), projects: clone(PROJECTS), categories: clone(CATEGORIES), recognitions: clone(RECOGNITIONS), rubric: clone(RUBRIC),
    notifications: clone(SEED_NOTIFICATIONS), baselineSessions: [], baselineResults: {
      [DEMO_USER_ID]: { level: "builder", nextLevel: "maker", confidence: 0.86, score: 82, questionsAnswered: 9, strengths: ["Generative AI", "Prompt Engineering", "AI Productivity"], growthAreas: ["AI Automation", "AI Application Development", "Project building"], skillsDetected: [{ skillId: "generative-ai", strength: 1 }, { skillId: "prompting", strength: 1 }, { skillId: "ai-productivity", strength: 0.8 }, { skillId: "automation", strength: 0.4 }], completedAt: "2026-05-21T10:00:00Z" },
    }, courseOpens: {}, feedback: [],
  };
}

let state: DbState | null = null;
const listeners = new Set<() => void>();

export function db(): DbState {
  if (state) return state;
  let loaded: DbState | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DbState;
        if (parsed.version === VERSION) loaded = parsed;
      }
    } catch { /* storage unavailable — fall back to seed */ }
  }
  state = loaded ?? seed();
  return state;
}

export function commit() {
  if (typeof window !== "undefined" && state) {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore quota / privacy mode */ }
  }
  listeners.forEach((l) => l());
}

export function resetDb() {
  state = seed();
  commit();
}

export const onDbChange = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };

export function currentUser(): User | null {
  const s = db();
  return s.users.find((u) => u.id === s.currentUserId) ?? null;
}

export function requireUser(): User {
  const u = currentUser();
  if (!u) throw new ApiError(401, "Please register or continue as the demo learner to use this page.");
  return u;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "ApiError"; }
}
