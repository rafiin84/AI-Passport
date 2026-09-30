import type { AnalyticsData, AppNotification, Credential, Enrollment, Evidence } from "@/types";

const d = (s: string) => `${s}T10:00:00Z`;

export const SEED_ENROLLMENTS: Enrollment[] = [
  { id: "e1", userId: "u-aarav", courseId: "c-ai-sdlc", state: "in_progress", progress: 64, startedAt: d("2026-09-02"), declaredAt: null, attempts: [], evidenceIds: [], credentialId: null },
  { id: "e2", userId: "u-aarav", courseId: "c-genai-essentials", state: "credential_issued", progress: 100, startedAt: d("2026-07-10"), declaredAt: d("2026-08-05"), attempts: [{ at: d("2026-08-06"), score: 100, passed: true }], evidenceIds: ["ev1"], credentialId: "cr-aarav-1" },
  { id: "e3", userId: "u-aarav", courseId: "c-prompt-basics", state: "credential_issued", progress: 100, startedAt: d("2026-06-01"), declaredAt: d("2026-06-20"), attempts: [{ at: d("2026-06-21"), score: 75, passed: true }], evidenceIds: ["ev2"], credentialId: "cr-aarav-2" },
  { id: "e4", userId: "u-aarav", courseId: "c-ai-automation", state: "assessment_ready", progress: 100, startedAt: d("2026-08-12"), declaredAt: d("2026-09-25"), attempts: [], evidenceIds: [], credentialId: null },
  { id: "e5", userId: "u-priya", courseId: "c-prompt-basics", state: "under_review", progress: 100, startedAt: d("2026-08-01"), declaredAt: d("2026-09-10"), attempts: [{ at: d("2026-09-11"), score: 100, passed: true }], evidenceIds: ["ev3"], credentialId: null },
  { id: "e6", userId: "u-ananya", courseId: "c-ai-app-dev", state: "evidence_submitted", progress: 100, startedAt: d("2026-07-01"), declaredAt: d("2026-09-18"), attempts: [{ at: d("2026-09-19"), score: 100, passed: true }], evidenceIds: ["ev4"], credentialId: null },
  { id: "e7", userId: "u-kavya", courseId: "c-ai-sdlc", state: "evidence_submitted", progress: 100, startedAt: d("2026-08-20"), declaredAt: d("2026-09-20"), attempts: [{ at: d("2026-09-21"), score: 83, passed: true }], evidenceIds: ["ev5"], credentialId: null },
];

const ev = (id: string, userId: string, courseId: string, type: Evidence["type"], url: string, note: string, at: string, status: Evidence["status"], reviewerNote: string | null): Evidence => ({
  id, userId, courseId, type, url, note, submittedAt: d(at), status, reviewerNote, rubricScores: null,
});

export const SEED_EVIDENCE: Evidence[] = [
  ev("ev1", "u-aarav", "c-genai-essentials", "demo", "https://example.org/aarav/weekly-report-workflow", "Weekly college-project report workflow with a review step.", "2026-08-06", "approved", "Clear workflow with a human checkpoint."),
  ev("ev2", "u-aarav", "c-prompt-basics", "screenshot", "https://example.org/aarav/prompt-library", "Prompt library with before/after outputs.", "2026-06-21", "approved", "Good iteration evidence."),
  ev("ev3", "u-priya", "c-prompt-basics", "url", "https://example.org/priya/prompts", "Prompts for invoice summaries and customer replies.", "2026-09-11", "under_review", null),
  ev("ev4", "u-ananya", "c-ai-app-dev", "repository", "https://github.com/example/ananya-agri-app", "Retrieval-backed advisory app for groundnut farmers.", "2026-09-19", "submitted", null),
  ev("ev5", "u-kavya", "c-ai-sdlc", "repository", "https://github.com/example/kavya-health-notes", "Patient-education note generator built with the course methodology.", "2026-09-21", "submitted", null),
];

export const SEED_CREDENTIALS: Credential[] = [
  { id: "cr-aarav-1", userId: "u-aarav", courseId: "c-genai-essentials", skillId: "generative-ai", type: "certificate", level: "builder", issuedAt: d("2026-08-09"), verificationStatus: "verified", credentialNumber: "AIP-2026-GEN-00417", evidenceIds: ["ev1"], basis: "Assessment score 100% and practical workflow demo reviewed" },
  { id: "cr-aarav-2", userId: "u-aarav", courseId: "c-prompt-basics", skillId: "prompting", type: "certificate", level: "explorer", issuedAt: d("2026-06-24"), verificationStatus: "verified", credentialNumber: "AIP-2026-PRM-00212", evidenceIds: ["ev2"], basis: "Assessment score 75% and prompt library reviewed" },
  { id: "cr-aarav-3", userId: "u-aarav", courseId: "c-genai-essentials", skillId: "ai-productivity", type: "badge", level: "builder", issuedAt: d("2026-08-09"), verificationStatus: "verified", credentialNumber: "AIP-2026-PRD-00418", evidenceIds: ["ev1"], basis: "Practical workflow demo reviewed" },
  { id: "cr-kavya-1", userId: "u-kavya", courseId: "c-genai-essentials", skillId: "generative-ai", type: "certificate", level: "builder", issuedAt: d("2026-08-15"), verificationStatus: "verified", credentialNumber: "AIP-2026-GEN-00433", evidenceIds: [], basis: "Assessment score 88%" },
  { id: "cr-ananya-1", userId: "u-ananya", courseId: "c-agents", skillId: "agents", type: "certificate", level: "maker", issuedAt: d("2026-08-28"), verificationStatus: "verified", credentialNumber: "AIP-2026-AGT-00460", evidenceIds: [], basis: "Assessment and demo reviewed" },
  { id: "cr-rohan-1", userId: "u-rohan", courseId: "c-rag-systems", skillId: "rag", type: "certificate", level: "pro", issuedAt: d("2026-07-30"), verificationStatus: "verified", credentialNumber: "AIP-2026-RAG-00388", evidenceIds: [], basis: "Repository and evaluation harness reviewed" },
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  ["n1", "credential", "Your Generative AI certificate is ready", "Generative AI Essentials is verified. View and share your certificate.", "2026-08-09", "/passport"],
  ["n2", "course", "You're 64% through AI SDLC", "Two more sections and you can show us what you learned.", "2026-09-28", "/learning/c-ai-sdlc"],
  ["n3", "assessment", "Ready to prove it?", "You declared AI Automation Foundations complete. Your verification is waiting.", "2026-09-25", "/learning/c-ai-automation/verify"],
  ["n4", "project", "StudyMitra was submitted", "We've received your project. A reviewer will look at it soon.", "2026-09-20", "/projects/p-shikshak"],
  ["n5", "recognition", "You've been shortlisted", "StudyMitra is on the AI for Education 2027 shortlist. Final results are published by the review team.", "2026-09-22", "/recognition"],
  ["n6", "system", "Welcome to AI Praman", "Find your level, learn, prove it and build something India can see.", "2026-05-20", "/dashboard"],
  ["n7", "course", "New course: AI in Indian Languages", "Curated for Builders interested in multilingual AI.", "2026-09-15", "/courses/c-indic-ai"],
  ["n8", "system", "Policy update", "We've updated our Privacy policy. Please review the changes.", "2026-09-12", "/policies/privacy"],
  ["n9", "credential", "Prompt Engineering certificate issued", "Your Explorer-level certificate is in your AI Praman.", "2026-06-24", "/passport"],
  ["n10", "assessment", "Your level: Builder", "You did it. Your baseline result is saved to your AI Praman.", "2026-05-21", "/assessment/result"],
  ["n11", "course", "Nice streak", "You've learned on 5 days this month.", "2026-09-27", "/learning"],
  ["n12", "system", "Language options", "You can switch between English and हिन्दी any time from the header.", "2026-05-20", "/settings"],
  ["n13", "project", "Add evidence to your project", "Projects with a live link and demo are easier to review.", "2026-09-18", "/projects"],
  ["n14", "recognition", "Recognition categories are open", "Submit a verified project to a category that fits your problem.", "2026-09-10", "/recognition"],
  ["n15", "course", "Continue: AI SDLC", "Next up: MCP — connecting tools and data.", "2026-09-26", "/learning/c-ai-sdlc"],
  ["n16", "system", "Accessibility settings", "Adjust text size, contrast and motion in Settings.", "2026-05-22", "/settings"],
  ["n17", "credential", "Badge unlocked: AI Productivity", "A new skill stamp was added to your AI Praman.", "2026-08-09", "/passport"],
  ["n18", "course", "Provider link check", "We re-checked provider links for your saved courses.", "2026-09-05", "/learning"],
  ["n19", "assessment", "Skill gap spotted", "Automation is your next growth area. See your path.", "2026-05-21", "/path"],
  ["n20", "system", "Feedback welcome", "Tell us what would make AI Praman better.", "2026-09-01", "/feedback"],
  ["n21", "project", "Project tip", "Describe the problem before the solution — reviewers read it first.", "2026-08-30", "/projects/new"],
].map(([id, kind, title, body, at, href], i) => ({ id: id as string, userId: "u-aarav", kind: kind as AppNotification["kind"], title: title as string, body: body as string, at: `${at}T09:00:00Z`, read: i > 5, href: href as string }));

export const ANALYTICS: AnalyticsData = {
  totals: {
    registrations: 48210, eligibleYouth: 41876, activeLearners: 19342, assessmentStarts: 36120, assessmentCompletions: 31877, courseOpens: 62451,
    completionDeclarations: 9320, verificationAttempts: 7015, credentialsIssued: 5138, projectsSubmitted: 2246, verifiedProjects: 731, recognitionShortlisted: 240,
  },
  levelDistribution: [
    { level: "starter", count: 9874 }, { level: "explorer", count: 12110 }, { level: "builder", count: 6902 }, { level: "maker", count: 2461 }, { level: "pro", count: 530 },
  ],
  stateDistribution: [
    { state: "Uttar Pradesh", count: 6120 }, { state: "Maharashtra", count: 5410 }, { state: "Karnataka", count: 4330 }, { state: "Tamil Nadu", count: 3988 },
    { state: "Bihar", count: 3240 }, { state: "Rajasthan", count: 2901 }, { state: "West Bengal", count: 2755 }, { state: "Telangana", count: 2610 },
  ],
  ageDistribution: [
    { band: "15–17", count: 5320 }, { band: "18–21", count: 18240 }, { band: "22–25", count: 15100 }, { band: "26–29", count: 3216 }, { band: "30+", count: 6334 },
  ],
  skillDemand: [
    { skill: "Prompt Engineering", count: 8120 }, { skill: "Generative AI", count: 7645 }, { skill: "AI Productivity", count: 5210 }, { skill: "AI Automation", count: 3180 },
    { skill: "AI SDLC", count: 2755 }, { skill: "Responsible AI", count: 2410 }, { skill: "RAG & Retrieval", count: 1180 },
  ],
  providerDemand: [
    { provider: "coursera", opens: 18220 }, { provider: "udemy", opens: 14680 }, { provider: "futureskills", opens: 11940 }, { provider: "linkedin", opens: 7100 },
    { provider: "indiaai", opens: 6320 }, { provider: "simplilearn", opens: 4191 },
  ],
  funnel: [
    { stage: "Registered", count: 48210 }, { stage: "Completed AI Challenge", count: 31877 }, { stage: "Opened a course", count: 22980 },
    { stage: "Declared completion", count: 9320 }, { stage: "Verified", count: 5138 }, { stage: "Submitted a project", count: 2246 },
  ],
  weekly: [
    { week: "W35", registrations: 2110, verifications: 210 }, { week: "W36", registrations: 2480, verifications: 260 }, { week: "W37", registrations: 2890, verifications: 310 },
    { week: "W38", registrations: 3340, verifications: 405 }, { week: "W39", registrations: 3910, verifications: 498 },
  ],
};
