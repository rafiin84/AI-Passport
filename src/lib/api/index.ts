/**
 * Typed, asynchronous MOCK API. Each function documents the REST route it stands in for.
 * There is no server: the same signatures can later be re-implemented with fetch() against a real backend.
 */
import { db, commit, currentUser, requireUser, ApiError, resetDb } from "./db";
import { delay, uid, ageFromDob } from "@/lib/utils";
import { BASELINE_QUESTIONS } from "@/mocks/assessments/baseline";
import { SKILLS } from "@/mocks/skills";
import { ANALYTICS } from "@/mocks/seed";
import { buildResult, confidenceOf, estimateLevel, initialEstimate, selectNext, shouldStop, updateEstimate } from "@/lib/ai/adaptive";
import { buildPath, recommendCourses } from "@/lib/ai/recommend";
import { analyzeCourse, detectProvider, generateAssessment, suggestRecognitionCategory, titleFromUrl, type AnalyzeInput } from "@/lib/ai/analyzer";
import { LEVEL_ORDER } from "@/constants/levels";
import type {
  AnalyticsData, AppNotification, Assessment, AssessmentResult, BaselineSession, Course, CourseAnalysis, Credential, Enrollment, EnrollmentState, Evidence, EvidenceType, LearningPath,
  PassportData, Project, ProjectStatus, Question, Recognition, RecognitionCategory, Skill, User, LevelId,
} from "@/types";
import { maskAadhaar } from "@/lib/utils";

const NOW = () => new Date().toISOString();

// ───────────────────────── Auth (mock) ─────────────────────────
/** POST /api/auth/aadhaar/mock — NEVER verifies identity. Any 12 digits and OTP "123456" succeed. */
export async function mockAadhaarAuth(input: { step: "request-otp" | "verify-otp" | "demo"; aadhaar?: string; otp?: string }): Promise<{ ok: true; masked: string; userId?: string }> {
  await delay(650);
  if (input.step === "demo") {
    db().currentUserId = "u-aarav"; commit();
    return { ok: true, masked: db().users.find((u) => u.id === "u-aarav")!.maskedAadhaar, userId: "u-aarav" };
  }
  const digits = (input.aadhaar ?? "").replace(/\D/g, "");
  if (digits.length !== 12) throw new ApiError(422, "Enter a 12-digit Aadhaar number. This is a mock — no real Aadhaar is checked.");
  if (input.step === "request-otp") return { ok: true, masked: maskAadhaar(digits) };
  if (input.otp !== "123456") throw new ApiError(401, "That OTP doesn't match. In this prototype, use 123456.");
  const id = uid("u");
  const now = NOW();
  const user: User = {
    id, name: "", dateOfBirth: "", age: 0, state: "", city: "", education: "", occupationStatus: "college_student", field: "", aiExperience: "none", goals: [], interests: [], preferredLanguage: "en",
    accessibilityPreferences: { largeText: false, highContrast: false, reduceMotion: false, screenReader: false }, ageEligibility: "general", currentLevel: null, maskedAadhaar: maskAadhaar(digits),
    avatarHue: Math.floor(Math.random() * 360), createdAt: now, updatedAt: now,
  };
  db().users.push(user); db().currentUserId = id; commit();
  return { ok: true, masked: user.maskedAadhaar, userId: id };
}

export async function signOut() { await delay(150); db().currentUserId = null; commit(); }
export async function resetPrototype() { await delay(200); resetDb(); }

// ───────────────────────── Profile ─────────────────────────
/** GET /api/profile */
export async function getProfile(): Promise<User | null> { await delay(200); return currentUser(); }

/** POST /api/profile */
export async function saveProfile(patch: Partial<User>): Promise<User> {
  await delay(400);
  const u = requireUser();
  Object.assign(u, patch);
  if (patch.dateOfBirth) u.age = ageFromDob(patch.dateOfBirth);
  u.ageEligibility = u.age >= 15 && u.age <= 29 ? "youth_eligible" : "general";
  u.updatedAt = NOW();
  commit();
  return u;
}

// ───────────────────────── Baseline assessment ─────────────────────────
const questionView = (q: Question | null) => q;

/** POST /api/assessment/baseline/start */
export async function startBaseline(): Promise<{ session: BaselineSession; question: Question }> {
  await delay(450);
  const u = requireUser();
  const est = initialEstimate(u);
  const first = selectNext(u, [], est);
  if (!first) throw new ApiError(409, "No suitable questions found for this profile.");
  const session: BaselineSession = { id: uid("bs"), userId: u.id, answers: [], estimate: est, confidence: 0.15, currentQuestionId: first.id, done: false, startedAt: NOW() };
  db().baselineSessions.push(session); commit();
  return { session, question: first };
}

export interface AnswerResponse { correct: boolean; explanation: string; correctAnswer: number; session: BaselineSession; next: Question | null; done: boolean; estimatedLevel: LevelId; skillSignal: { skillId: string; correct: boolean } }

/** POST /api/assessment/baseline/answer */
export async function answerBaseline(input: { sessionId: string; questionId: string; selected: number }): Promise<AnswerResponse> {
  await delay(250);
  const u = requireUser();
  const s = db().baselineSessions.find((x) => x.id === input.sessionId && x.userId === u.id);
  const q = BASELINE_QUESTIONS.find((x) => x.id === input.questionId);
  if (!s || !q) throw new ApiError(404, "Assessment session not found.");
  if (s.answers.some((a) => a.questionId === q.id)) throw new ApiError(409, "Question already answered.");
  const correct = input.selected === q.correctAnswer;
  s.answers.push({ questionId: q.id, selected: input.selected, correct, skill: q.skill, difficulty: q.difficulty });
  s.estimate = updateEstimate(s.estimate, q, correct, s.answers.length);
  s.confidence = confidenceOf(s.answers);
  const stop = shouldStop(s.answers, s.confidence);
  const next = stop ? null : selectNext(u, s.answers, s.estimate);
  s.currentQuestionId = next?.id ?? null;
  s.done = !next;
  commit();
  return { correct, explanation: q.explanation, correctAnswer: q.correctAnswer, session: s, next: questionView(next), done: s.done, estimatedLevel: estimateLevel(s.estimate), skillSignal: { skillId: q.skill, correct } };
}

/** POST /api/assessment/baseline/complete */
export async function completeBaseline(sessionId: string): Promise<AssessmentResult> {
  await delay(900);
  const u = requireUser();
  const s = db().baselineSessions.find((x) => x.id === sessionId && x.userId === u.id);
  if (!s) throw new ApiError(404, "Assessment session not found.");
  const result = buildResult(u, s.answers, s.estimate, s.confidence);
  db().baselineResults[u.id] = result;
  u.currentLevel = result.level; u.updatedAt = NOW();
  db().notifications.unshift({ id: uid("n"), userId: u.id, kind: "assessment", title: `You're a ${result.level === "pro" ? "AI Pro" : result.level.charAt(0).toUpperCase() + result.level.slice(1)}`, body: "Your baseline result is saved to your Passport.", at: NOW(), read: false, href: "/assessment/result" });
  commit();
  return result;
}

/** GET /api/assessment/baseline/result */
export async function getBaselineResult(): Promise<AssessmentResult | null> { await delay(250); const u = requireUser(); return db().baselineResults[u.id] ?? null; }

export async function getLearningPath(): Promise<LearningPath | null> {
  await delay(300);
  const u = requireUser();
  const r = db().baselineResults[u.id];
  const level = u.currentLevel ?? r?.level;
  if (!level) return null;
  const mine = db().enrollments.filter((e) => e.userId === u.id);
  const done = mine.filter((e) => e.state === "credential_issued" || e.state === "verified").map((e) => e.courseId);
  const started = mine.filter((e) => e.state !== "not_started").map((e) => e.courseId);
  const gapSkills = SKILLS.filter((s) => r?.growthAreas.includes(s.name)).map((s) => s.id);
  return buildPath(u, level, done, started, gapSkills);
}

// ───────────────────────── Courses ─────────────────────────
export interface CourseQuery { level?: LevelId; provider?: string; q?: string; free?: boolean; domain?: string; recommendedFor?: boolean }

/** GET /api/courses */
export async function listCourses(query: CourseQuery = {}): Promise<Course[]> {
  await delay(350);
  const u = currentUser();
  let list = db().courses.filter((c) => c.status === "published");
  if (query.level) list = list.filter((c) => c.level === query.level);
  if (query.provider) list = list.filter((c) => c.provider === query.provider);
  if (query.free) list = list.filter((c) => c.priceType === "free" || c.priceType === "free_audit");
  if (query.domain) list = list.filter((c) => c.domains.includes(query.domain!) || c.categories.some((x) => x.includes(query.domain!)));
  if (query.q) {
    const t = query.q.toLowerCase();
    list = list.filter((c) => `${c.title} ${c.description} ${c.skills.join(" ")} ${c.categories.join(" ")}`.toLowerCase().includes(t));
  }
  if (query.recommendedFor && u?.currentLevel) list = recommendCourses(u, u.currentLevel, [], [], 50).filter((c) => list.some((l) => l.id === c.id));
  return list;
}

/** GET /api/courses/:id */
export async function getCourse(id: string): Promise<{ course: Course; enrollment: Enrollment | null; assessmentReady: boolean }> {
  await delay(300);
  const course = db().courses.find((c) => c.id === id);
  if (!course) throw new ApiError(404, "We couldn't find that course.");
  const u = currentUser();
  const enrollment = u ? db().enrollments.find((e) => e.userId === u.id && e.courseId === id) ?? null : null;
  const a = db().assessments.find((x) => x.courseId === id && x.reviewStatus === "approved");
  return { course, enrollment, assessmentReady: !!a };
}

export async function recordCourseOpen(id: string) { db().courseOpens[id] = (db().courseOpens[id] ?? 0) + 1; commit(); }

/** POST /api/courses/:id/start */
export async function startCourse(id: string): Promise<Enrollment> {
  await delay(300);
  const u = requireUser();
  let e = db().enrollments.find((x) => x.userId === u.id && x.courseId === id);
  if (!e) {
    e = { id: uid("e"), userId: u.id, courseId: id, state: "in_progress", progress: 0, startedAt: NOW(), declaredAt: null, attempts: [], evidenceIds: [], credentialId: null };
    db().enrollments.push(e);
  } else if (e.state === "not_started") e.state = "in_progress";
  await recordCourseOpen(id);
  commit();
  return e;
}

export async function updateProgress(id: string, progress: number): Promise<Enrollment> {
  await delay(200);
  const u = requireUser();
  const e = db().enrollments.find((x) => x.userId === u.id && x.courseId === id);
  if (!e) throw new ApiError(404, "You haven't started this course yet.");
  e.progress = Math.max(0, Math.min(100, progress)); commit();
  return e;
}

/** POST /api/courses/:id/declare-complete */
export async function declareComplete(id: string): Promise<Enrollment> {
  await delay(500);
  const u = requireUser();
  const e = db().enrollments.find((x) => x.userId === u.id && x.courseId === id);
  if (!e) throw new ApiError(404, "You haven't started this course yet.");
  const ready = db().assessments.some((a) => a.courseId === id && a.reviewStatus === "approved");
  e.progress = 100; e.declaredAt = NOW();
  e.state = ready ? "assessment_ready" : "declared_complete";
  commit();
  return e;
}

export async function getEnrollments(): Promise<(Enrollment & { course: Course })[]> {
  await delay(300);
  const u = requireUser();
  return db().enrollments.filter((e) => e.userId === u.id).map((e) => ({ ...e, course: db().courses.find((c) => c.id === e.courseId)! })).filter((e) => e.course);
}

export async function getRecommendations(limit = 4): Promise<Course[]> {
  await delay(300);
  const u = requireUser();
  const r = db().baselineResults[u.id];
  const level = u.currentLevel ?? "starter";
  const gaps = SKILLS.filter((s) => r?.growthAreas.includes(s.name)).map((s) => s.id);
  const taken = db().enrollments.filter((e) => e.userId === u.id).map((e) => e.courseId);
  return recommendCourses(u, level, gaps, taken, limit);
}

// ───────────────────────── Verification ─────────────────────────
export interface VerificationView { assessment: Assessment | null; enrollment: Enrollment; course: Course }

/** POST /api/courses/:id/verification/start */
export async function startVerification(courseId: string): Promise<VerificationView> {
  await delay(400);
  const u = requireUser();
  const enrollment = db().enrollments.find((x) => x.userId === u.id && x.courseId === courseId);
  const course = db().courses.find((c) => c.id === courseId);
  if (!enrollment || !course) throw new ApiError(404, "Start this course before verifying it.");
  if (enrollment.state === "in_progress" || enrollment.state === "not_started") throw new ApiError(409, "Declare the course complete first.");
  const assessment = db().assessments.find((a) => a.courseId === courseId && a.reviewStatus === "approved") ?? null;
  return { assessment, enrollment, course };
}

export interface VerificationOutcome { score: number; passed: boolean; correct: number; total: number; review: { id: string; prompt: string; options: string[]; selected: number; correctAnswer: number; explanation: string }[]; enrollment: Enrollment; nextStep: "evidence" | "credential" | "retry" }

/** POST /api/courses/:id/verification/answer — submits the whole set of answers. */
export async function submitVerification(courseId: string, answers: Record<string, number>): Promise<VerificationOutcome> {
  await delay(900);
  const u = requireUser();
  const e = db().enrollments.find((x) => x.userId === u.id && x.courseId === courseId);
  const a = db().assessments.find((x) => x.courseId === courseId && x.reviewStatus === "approved");
  const course = db().courses.find((c) => c.id === courseId);
  if (!e || !a || !course) throw new ApiError(404, "No approved assessment for this course yet.");
  const items = [...a.questions, ...a.scenarios];
  const review = items.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options, selected: answers[q.id] ?? -1, correctAnswer: q.correctAnswer, explanation: q.explanation }));
  const correct = review.filter((r) => r.selected === r.correctAnswer).length;
  const score = Math.round((correct / Math.max(1, items.length)) * 100);
  const passed = score >= a.passMark;
  e.attempts.push({ at: NOW(), score, passed });
  let nextStep: VerificationOutcome["nextStep"] = "retry";
  if (!passed) e.state = "not_verified";
  else if (a.practical && course.evidenceTypes.length) { e.state = "evidence_required"; nextStep = "evidence"; }
  else { e.state = "passed"; issueCredential(e, "Assessment passed"); nextStep = "credential"; }
  commit();
  return { score, passed, correct, total: items.length, review, enrollment: e, nextStep };
}

function issueCredential(e: Enrollment, basis: string) {
  const course = db().courses.find((c) => c.id === e.courseId)!;
  const skillId = course.skills[0]!;
  const n = 500 + db().credentials.length;
  const cred: Credential = {
    id: uid("cr"), userId: e.userId, courseId: e.courseId, skillId, type: "certificate", level: course.level, issuedAt: NOW(), verificationStatus: "verified",
    credentialNumber: `AIP-2026-${skillId.replace(/[^a-z]/g, "").slice(0, 3).toUpperCase()}-${String(n).padStart(5, "0")}`, evidenceIds: e.evidenceIds, basis,
  };
  db().credentials.push(cred);
  // Badges for additional skills of the course
  course.skills.slice(1, 3).forEach((sk, i) => db().credentials.push({ ...cred, id: uid("cr"), skillId: sk, type: "badge", credentialNumber: `${cred.credentialNumber}-B${i + 1}` }));
  e.state = "credential_issued"; e.credentialId = cred.id;
  db().notifications.unshift({ id: uid("n"), userId: e.userId, kind: "credential", title: `${course.title} is verified`, body: "Your certificate is ready. View it in your Passport.", at: NOW(), read: false, href: `/credentials/${cred.id}` });
}

/** POST /api/courses/:id/evidence */
export async function submitEvidence(courseId: string, items: { type: EvidenceType; url: string; note: string }[]): Promise<Enrollment> {
  await delay(800);
  const u = requireUser();
  const e = db().enrollments.find((x) => x.userId === u.id && x.courseId === courseId);
  if (!e) throw new ApiError(404, "Enrollment not found.");
  if (e.state !== "evidence_required" && e.state !== "not_verified" && e.state !== "evidence_submitted") throw new ApiError(409, "Evidence isn't needed right now.");
  for (const it of items) {
    const ev: Evidence = { id: uid("ev"), userId: u.id, courseId, type: it.type, url: it.url, note: it.note, submittedAt: NOW(), status: "under_review", reviewerNote: null, rubricScores: null };
    db().evidence.push(ev); e.evidenceIds.push(ev.id);
  }
  e.state = "under_review"; commit();
  return e;
}

// ───────────────────────── Skills & credentials ─────────────────────────
/** GET /api/skills */
export async function listSkills(): Promise<Skill[]> { await delay(150); return SKILLS; }

/** GET /api/credentials */
export async function listCredentials(): Promise<(Credential & { courseTitle: string; skillName: string })[]> {
  await delay(250);
  const u = requireUser();
  return db().credentials.filter((c) => c.userId === u.id).map((c) => ({ ...c, courseTitle: db().courses.find((x) => x.id === c.courseId)?.title ?? "", skillName: SKILLS.find((s) => s.id === c.skillId)?.name ?? c.skillId })).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
}

export async function getCredential(id: string) {
  await delay(250);
  const c = db().credentials.find((x) => x.id === id || x.credentialNumber === id);
  if (!c) throw new ApiError(404, "We couldn't find that credential.");
  const user = db().users.find((u) => u.id === c.userId)!;
  const course = db().courses.find((x) => x.id === c.courseId)!;
  const evidence = db().evidence.filter((e) => c.evidenceIds.includes(e.id));
  return { credential: c, learnerName: user.name, learnerState: user.state, course, skillName: SKILLS.find((s) => s.id === c.skillId)?.name ?? c.skillId, evidenceTypes: [...new Set(evidence.map((e) => e.type))] };
}

// ───────────────────────── Passport ─────────────────────────
/** GET /api/passport */
export async function getPassport(userId?: string): Promise<PassportData> {
  await delay(400);
  const user = userId ? db().users.find((u) => u.id === userId) : requireUser();
  if (!user) throw new ApiError(404, "We couldn't find that learner.");
  const credentials = db().credentials.filter((c) => c.userId === user.id);
  const verifiedSkills = credentials.map((c) => ({ skill: SKILLS.find((s) => s.id === c.skillId)!, level: c.level, date: c.issuedAt, credentialId: c.id, status: c.verificationStatus })).filter((v) => v.skill);
  const projects = db().projects.filter((p) => p.userId === user.id);
  const recognitions = db().recognitions.filter((r) => r.userId === user.id && r.status === "published").map((r) => ({ ...r, projectTitle: db().projects.find((p) => p.id === r.projectId)?.title ?? "", categoryName: db().categories.find((c) => c.id === r.category)?.name ?? r.category }));
  const have = new Set(verifiedSkills.map((v) => v.skill.id));
  const level = user.currentLevel ?? null;
  const result = db().baselineResults[user.id];
  const nextSkill = SKILLS.find((s) => result?.growthAreas.includes(s.name) && !have.has(s.id)) ?? SKILLS.find((s) => !have.has(s.id) && level && s.levels.includes(LEVEL_ORDER[Math.min(4, LEVEL_ORDER.indexOf(level) + 1)]!)) ?? null;
  const timeline = [
    ...(result ? [{ id: "t-base", at: result.completedAt, title: `Baseline AI Challenge — ${result.level}`, kind: "assessment" }] : []),
    ...credentials.map((c) => ({ id: `t-${c.id}`, at: c.issuedAt, title: `${c.type === "badge" ? "Badge" : "Certificate"}: ${SKILLS.find((s) => s.id === c.skillId)?.name}`, kind: "credential" })),
    ...projects.filter((p) => p.status !== "draft").map((p) => ({ id: `t-${p.id}`, at: p.createdAt, title: `Project: ${p.title}`, kind: "project" })),
    ...recognitions.map((r) => ({ id: `t-${r.id}`, at: "2026-09-22T10:00:00Z", title: `Recognition: ${r.categoryName}`, kind: "recognition" })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  const learning = db().enrollments.filter((e) => e.userId === user.id).map((e) => ({ courseId: e.courseId, title: db().courses.find((c) => c.id === e.courseId)?.title ?? "", progress: e.progress, state: e.state }));
  return { user, level, nextSkill, verifiedSkills, credentials, projects, recognitions, timeline, learning };
}

// ───────────────────────── Projects ─────────────────────────
/** GET /api/projects */
export async function listProjects(scope: "mine" | "public" = "mine"): Promise<Project[]> {
  await delay(300);
  if (scope === "public") return db().projects.filter((p) => p.status === "verified" || p.status === "featured");
  const u = requireUser();
  return db().projects.filter((p) => p.userId === u.id);
}

export async function getProject(id: string): Promise<{ project: Project; owner: User; mine: boolean }> {
  await delay(250);
  const project = db().projects.find((p) => p.id === id);
  if (!project) throw new ApiError(404, "We couldn't find that project.");
  const owner = db().users.find((u) => u.id === project.userId)!;
  const { reviewerNotes: _hidden, ...pub } = project;
  return { project: currentUser()?.id === project.userId ? project : (pub as Project), owner, mine: currentUser()?.id === project.userId };
}

/** POST /api/projects */
export async function createProject(input: Omit<Project, "id" | "userId" | "status" | "createdAt" | "recognitionCategory" | "reviewerNotes" | "evidence" | "screenshots"> & { screenshots?: string[] }): Promise<Project> {
  await delay(600);
  const u = requireUser();
  const p: Project = { ...input, screenshots: input.screenshots ?? [], evidence: [input.liveUrl, input.repositoryUrl, input.demoUrl].filter(Boolean), id: uid("p"), userId: u.id, status: "draft", recognitionCategory: null, createdAt: NOW() };
  db().projects.push(p); commit();
  return p;
}

/** POST /api/projects/:id/submit */
export async function submitProject(id: string, categoryId?: string): Promise<Project> {
  await delay(700);
  const u = requireUser();
  const p = db().projects.find((x) => x.id === id && x.userId === u.id);
  if (!p) throw new ApiError(404, "Project not found.");
  if (!p.liveUrl && !p.repositoryUrl && !p.demoUrl) throw new ApiError(422, "Add at least a live link, repository or demo so reviewers can see your work.");
  p.status = "submitted"; if (categoryId) p.recognitionCategory = categoryId;
  db().notifications.unshift({ id: uid("n"), userId: u.id, kind: "project", title: `${p.title} was submitted`, body: "A reviewer will look at it soon.", at: NOW(), read: false, href: `/projects/${p.id}` });
  commit();
  return p;
}

export async function suggestCategory(text: string) { await delay(500); return suggestRecognitionCategory(text); }

// ───────────────────────── Recognition ─────────────────────────
/** GET /api/recognition/categories */
export async function listRecognitionCategories(): Promise<(RecognitionCategory & { count: number })[]> {
  await delay(250);
  return db().categories.filter((c) => c.status !== "draft").map((c) => ({ ...c, count: db().recognitions.filter((r) => r.category === c.id && r.status === "published").length }));
}

export interface RecognitionEntry { recognition: Omit<Recognition, "reviewerNotes">; learner: Pick<User, "id" | "name" | "age" | "state" | "currentLevel" | "avatarHue">; project: Project }

/** GET /api/recognition/:category — reviewer notes and raw scores are never returned publicly. */
export async function getRecognitionCategory(categoryId: string): Promise<{ category: RecognitionCategory; entries: RecognitionEntry[] }> {
  await delay(350);
  const category = db().categories.find((c) => c.id === categoryId);
  if (!category) throw new ApiError(404, "We couldn't find that category.");
  const entries = db().recognitions.filter((r) => r.category === categoryId && r.status === "published").sort((a, b) => a.rank - b.rank).map((r) => {
    const { reviewerNotes: _n, ...pub } = r;
    const u = db().users.find((x) => x.id === r.userId)!;
    const { reviewerNotes: _pn, ...proj } = db().projects.find((p) => p.id === r.projectId)!;
    return { recognition: pub, learner: { id: u.id, name: u.name, age: u.age, state: u.state, currentLevel: u.currentLevel, avatarHue: u.avatarHue }, project: proj as Project };
  });
  return { category, entries };
}

export async function getPublicLearner(id: string) {
  await delay(300);
  const p = await getPassport(id);
  // Public view: no Aadhaar, DOB or city
  return { name: p.user.name, state: p.user.state, level: p.level, age: p.user.age, verifiedSkills: p.verifiedSkills, projects: p.projects.filter((x) => x.status === "verified" || x.status === "featured"), recognitions: p.recognitions, avatarHue: p.user.avatarHue };
}

// ───────────────────────── Notifications, feedback ─────────────────────────
export async function listNotifications(): Promise<AppNotification[]> { await delay(200); const u = requireUser(); return db().notifications.filter((n) => n.userId === u.id); }
export async function markNotificationsRead() { await delay(100); const u = requireUser(); db().notifications.forEach((n) => { if (n.userId === u.id) n.read = true; }); commit(); }
export async function sendFeedback(message: string, email?: string) { await delay(600); db().feedback.push({ at: NOW(), message, email }); commit(); return { ok: true as const, reference: `FB-${Date.now().toString().slice(-6)}` }; }

/** Prototype-only: simulate the human reviewer approving submitted evidence, so the full learner loop can be experienced. */
export async function demoApproveMyEvidence(courseId: string): Promise<Enrollment> {
  await delay(700);
  const u = requireUser();
  const e = db().enrollments.find((x) => x.userId === u.id && x.courseId === courseId);
  if (!e) throw new ApiError(404, "Enrollment not found.");
  return approveEvidenceFor(e);
}

function approveEvidenceFor(e: Enrollment) {
  db().evidence.filter((ev) => e.evidenceIds.includes(ev.id)).forEach((ev) => { ev.status = "approved"; ev.reviewerNote = ev.reviewerNote ?? "Meets the rubric."; });
  issueCredential(e, "Assessment passed and practical evidence reviewed");
  commit();
  return e;
}

// ───────────────────────── Admin ─────────────────────────
/** GET /api/admin/courses */
export async function adminListCourses(): Promise<Course[]> { await delay(300); return db().courses; }

/** POST /api/admin/courses/analyze */
export async function adminAnalyzeCourse(input: AnalyzeInput): Promise<{ analysis: CourseAnalysis; provider: string | null; title: string }> {
  await delay(1600);
  try { new URL(input.url); } catch { throw new ApiError(422, "Paste a full course URL starting with https://"); }
  const provider = input.provider ?? detectProvider(input.url);
  return { analysis: analyzeCourse(input), provider, title: input.title || db().courses.find((c) => c.url === input.url)?.title || titleFromUrl(input.url) };
}

export type CourseDraft = Omit<Course, "id" | "createdAt" | "updatedAt" | "sourceMetadata" | "thumbnail" | "sections" | "verificationAssessmentId" | "instructor"> & { id?: string; thumbnail?: Course["thumbnail"]; instructor?: string };

/** POST /api/admin/courses (create or update) */
export async function adminSaveCourse(draft: CourseDraft): Promise<Course> {
  await delay(500);
  const existing = draft.id ? db().courses.find((c) => c.id === draft.id) : undefined;
  if (existing) { const { thumbnail, instructor, ...rest } = draft; Object.assign(existing, rest, thumbnail ? { thumbnail } : {}, instructor ? { instructor } : {}, { updatedAt: NOW() }); commit(); return existing; }
  const course: Course = {
    ...draft, id: uid("c"), instructor: draft.instructor ?? "Instructor as listed on provider site", thumbnail: draft.thumbnail ?? { from: "#818cf8", to: "#312e81", icon: "Books" }, sections: [{ title: "Course outline to be confirmed with provider", lessons: 0 }], verificationAssessmentId: null,
    sourceMetadata: { urlStatus: "provider-search", curatedOn: NOW().slice(0, 10), note: "Added through the admin console. Confirm details on the provider site." }, createdAt: NOW(), updatedAt: NOW(),
  };
  db().courses.unshift(course); commit();
  return course;
}

/** POST /api/admin/courses/:id/generate-assessment */
export async function adminGenerateAssessment(courseId: string): Promise<Assessment> {
  await delay(1800);
  const course = db().courses.find((c) => c.id === courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  const a = generateAssessment(course);
  const idx = db().assessments.findIndex((x) => x.courseId === courseId);
  if (idx >= 0) db().assessments[idx] = a; else db().assessments.push(a);
  commit();
  return a;
}

export async function adminListAssessments(): Promise<(Assessment & { courseTitle: string })[]> { await delay(250); return db().assessments.map((a) => ({ ...a, courseTitle: db().courses.find((c) => c.id === a.courseId)?.title ?? "Baseline" })); }
export async function adminGetAssessment(courseId: string): Promise<Assessment | null> { await delay(250); return db().assessments.find((a) => a.courseId === courseId) ?? null; }
export async function adminSaveAssessment(a: Assessment): Promise<Assessment> {
  await delay(400);
  const idx = db().assessments.findIndex((x) => x.id === a.id);
  if (idx >= 0) db().assessments[idx] = a; else db().assessments.push(a);
  commit(); return a;
}
export async function adminSetAssessmentReview(id: string, status: Assessment["reviewStatus"]) {
  await delay(400);
  const a = db().assessments.find((x) => x.id === id);
  if (!a) throw new ApiError(404, "Assessment not found.");
  a.reviewStatus = status; a.publishedAt = status === "approved" ? NOW() : null;
  const c = db().courses.find((x) => x.id === a.courseId); if (c) c.verificationAssessmentId = status === "approved" ? a.id : null;
  commit(); return a;
}

/** POST /api/admin/courses/:id/publish */
export async function adminSetCourseStatus(id: string, status: Course["status"] | "feature" | "unfeature"): Promise<Course> {
  await delay(400);
  const c = db().courses.find((x) => x.id === id);
  if (!c) throw new ApiError(404, "Course not found.");
  if (status === "feature") c.featured = true; else if (status === "unfeature") c.featured = false; else c.status = status;
  c.updatedAt = NOW(); commit(); return c;
}

/** GET /api/admin/learners */
export async function adminListLearners(): Promise<(User & { credentialCount: number; courseCount: number; projectCount: number })[]> {
  await delay(300);
  return db().users.filter((u) => u.name).map((u) => ({ ...u, credentialCount: db().credentials.filter((c) => c.userId === u.id).length, courseCount: db().enrollments.filter((e) => e.userId === u.id).length, projectCount: db().projects.filter((p) => p.userId === u.id).length }));
}
export async function adminGetLearner(id: string) { await delay(250); return getPassport(id); }

/** GET /api/admin/evidence */
export async function adminListEvidence(): Promise<(Evidence & { learnerName: string; courseTitle: string })[]> {
  await delay(300);
  return db().evidence.map((e) => ({ ...e, learnerName: db().users.find((u) => u.id === e.userId)?.name ?? "", courseTitle: db().courses.find((c) => c.id === e.courseId)?.title ?? "" })).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

/** POST /api/admin/evidence/:id/review */
export async function adminReviewEvidence(id: string, decision: "approved" | "rejected", note: string, scores?: Record<string, number>): Promise<Evidence> {
  await delay(600);
  const ev = db().evidence.find((e) => e.id === id);
  if (!ev) throw new ApiError(404, "Evidence not found.");
  ev.status = decision; ev.reviewerNote = note; ev.rubricScores = scores ?? null;
  const e = db().enrollments.find((x) => x.userId === ev.userId && x.courseId === ev.courseId);
  if (e) {
    if (decision === "approved" && e.state !== "credential_issued") approveEvidenceFor(e);
    if (decision === "rejected") { e.state = "not_verified"; db().notifications.unshift({ id: uid("n"), userId: e.userId, kind: "course", title: "More work needed on your evidence", body: note || "A reviewer asked for changes. You can resubmit.", at: NOW(), read: false, href: `/learning/${e.courseId}/evidence` }); }
  }
  commit(); return ev;
}

export async function adminListCredentials() {
  await delay(300);
  return db().credentials.map((c) => ({ ...c, learnerName: db().users.find((u) => u.id === c.userId)?.name ?? "", courseTitle: db().courses.find((x) => x.id === c.courseId)?.title ?? "", skillName: SKILLS.find((s) => s.id === c.skillId)?.name ?? c.skillId }));
}
export async function adminRevokeCredential(id: string, revoke: boolean) { await delay(400); const c = db().credentials.find((x) => x.id === id); if (c) c.verificationStatus = revoke ? "revoked" : "verified"; commit(); }

export async function adminListProjects(): Promise<(Project & { learnerName: string })[]> { await delay(300); return db().projects.map((p) => ({ ...p, learnerName: db().users.find((u) => u.id === p.userId)?.name ?? "" })); }
export async function adminSetProjectStatus(id: string, status: ProjectStatus, note?: string) {
  await delay(400);
  const p = db().projects.find((x) => x.id === id); if (!p) throw new ApiError(404, "Project not found.");
  p.status = status; if (note !== undefined) p.reviewerNotes = note;
  commit(); return p;
}

export async function adminGetRecognition() {
  await delay(300);
  return { categories: db().categories, recognitions: db().recognitions.map((r) => ({ ...r, learnerName: db().users.find((u) => u.id === r.userId)?.name ?? "", projectTitle: db().projects.find((p) => p.id === r.projectId)?.title ?? "" })), rubric: db().rubric };
}
export async function adminSaveCategory(c: Partial<RecognitionCategory> & { name: string }) {
  await delay(400);
  const id = c.id ?? c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const ex = db().categories.find((x) => x.id === id);
  if (ex) Object.assign(ex, c); else db().categories.push({ id, name: c.name, description: c.description ?? "", icon: c.icon ?? "Star", status: c.status ?? "draft", year: c.year ?? 2027 });
  commit();
}
export async function adminSetRecognitionStatus(id: string, status: Recognition["status"], notes?: string) {
  await delay(400);
  const r = db().recognitions.find((x) => x.id === id); if (!r) throw new ApiError(404, "Entry not found.");
  r.status = status; if (notes !== undefined) r.reviewerNotes = notes;
  commit();
}
export async function adminScoreProject(input: { projectId: string; category: string; scores: Record<string, number> }) {
  await delay(500);
  const rubric = db().rubric; const total = rubric.reduce((s, c) => s + c.weight, 0);
  const weighted = rubric.reduce((s, c) => s + (input.scores[c.id] ?? 0) * c.weight, 0) / total * 10;
  const p = db().projects.find((x) => x.id === input.projectId); if (!p) throw new ApiError(404, "Project not found.");
  let r = db().recognitions.find((x) => x.projectId === input.projectId && x.category === input.category);
  if (!r) { r = { id: uid("r"), category: input.category, year: 2027, rank: 99, userId: p.userId, projectId: p.id, rubricScore: 0, rubricBreakdown: {}, status: "shortlisted", reviewerNotes: "" }; db().recognitions.push(r); }
  r.rubricScore = Math.round(weighted); r.rubricBreakdown = input.scores;
  db().recognitions.filter((x) => x.category === input.category).sort((a, b) => b.rubricScore - a.rubricScore).forEach((x, i) => { x.rank = i + 1; });
  commit();
}
export async function adminSaveRubric(items: { id: string; label: string; weight: number }[]) { await delay(300); db().rubric = items; commit(); }

/** GET /api/admin/analytics */
export async function adminAnalytics(): Promise<AnalyticsData> { await delay(500); return ANALYTICS; }
