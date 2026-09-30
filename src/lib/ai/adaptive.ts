import { BASELINE_QUESTIONS } from "@/mocks/assessments/baseline";
import { LEVEL_ORDER } from "@/constants/levels";
import type { AiExperience, AssessmentResult, BaselineAnswer, LevelId, Question, User } from "@/types";
import { skillById } from "@/mocks/skills";

const MIN_QUESTIONS = 6;
const MAX_QUESTIONS = 12;

const EXPERIENCE_PRIOR: Record<AiExperience, number> = { none: 0.6, beginner: 1.3, intermediate: 2.2, advanced: 3.0 };
const difficultyLocation = (d: number) => d - 0.5; // level band centre

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const initialEstimate = (user: Pick<User, "aiExperience" | "age">) => EXPERIENCE_PRIOR[user.aiExperience] - (user.age < 17 ? 0.2 : 0);

export function estimateLevel(estimate: number): LevelId {
  const idx = Math.min(4, Math.max(0, Math.floor(estimate)));
  return LEVEL_ORDER[idx]!;
}

export function isSuitable(q: Question, user: Pick<User, "age" | "occupationStatus">) {
  const ageOk = user.age >= q.ageSuitability[0] && user.age <= q.ageSuitability[1];
  const profileOk = q.profileSuitability.includes("all") || q.profileSuitability.includes(user.occupationStatus);
  return ageOk && profileOk;
}

/** Interest → skills that matter to this learner; used to break ties between equally informative questions. */
const INTEREST_SKILLS: Record<string, string[]> = {
  Education: ["ai-for-education"], Healthcare: ["ai-for-healthcare"], Agriculture: ["ai-for-agriculture"], "Software development": ["ai-assisted-coding", "product-discovery", "mcp"],
  MSMEs: ["automation", "ai-productivity"], Finance: ["automation"], Governance: ["responsible-ai"], "Rural India": ["ai-for-agriculture"],
};

export function selectNext(user: User, answers: BaselineAnswer[], estimate: number): Question | null {
  if (answers.length >= MAX_QUESTIONS) return null;
  const asked = new Set(answers.map((a) => a.questionId));
  const recentSkills = answers.slice(-2).map((a) => a.skill);
  const interestSkills = new Set(user.interests.flatMap((i) => INTEREST_SKILLS[i] ?? []));

  const pool = BASELINE_QUESTIONS.filter((q) => !asked.has(q.id) && isSuitable(q, user));
  if (pool.length === 0) return null;

  const scored = pool.map((q) => {
    const info = -Math.abs(difficultyLocation(q.difficulty) - estimate); // most informative when near the estimate
    const variety = recentSkills.includes(q.skill) ? -0.6 : 0;
    const interest = interestSkills.has(q.skill) ? 0.25 : 0;
    const stable = -(q.id.charCodeAt(3) % 7) * 0.001; // deterministic tie-break
    return { q, s: info + variety + interest + stable };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored[0]!.q;
}

export function updateEstimate(estimate: number, q: Question, correct: boolean, nAnswered: number) {
  const expected = sigmoid((estimate - difficultyLocation(q.difficulty)) * 1.6);
  const k = Math.max(0.35, 1.1 - nAnswered * 0.08); // smaller steps as evidence accumulates
  return Math.min(4.99, Math.max(0.05, estimate + k * ((correct ? 1 : 0) - expected)));
}

export function confidenceOf(answers: BaselineAnswer[]) {
  if (answers.length === 0) return 0.15;
  const base = 1 - Math.exp(-answers.length / 5);
  // Consistency: how often answers agreed with the running expectation
  const nearHits = answers.filter((a) => (a.correct ? a.difficulty <= 5 : true)).length;
  return Math.min(0.96, 0.25 + 0.7 * base * (0.85 + 0.15 * (nearHits / answers.length)));
}

export function shouldStop(answers: BaselineAnswer[], confidence: number) {
  return answers.length >= MAX_QUESTIONS || (answers.length >= MIN_QUESTIONS && confidence >= 0.8);
}

export function buildResult(user: User, answers: BaselineAnswer[], estimate: number, confidence: number): AssessmentResult {
  const level = estimateLevel(estimate);
  const bySkill = new Map<string, { right: number; total: number }>();
  for (const a of answers) {
    const s = bySkill.get(a.skill) ?? { right: 0, total: 0 };
    s.total += 1;
    if (a.correct) s.right += 1;
    bySkill.set(a.skill, s);
  }
  const skillsDetected = [...bySkill.entries()].map(([skillId, v]) => ({ skillId, strength: v.right / v.total }));
  const strengths = skillsDetected.filter((s) => s.strength >= 0.5).sort((a, b) => b.strength - a.strength).slice(0, 3).map((s) => skillById(s.skillId)?.name ?? s.skillId);
  const growth = skillsDetected.filter((s) => s.strength < 0.5).map((s) => skillById(s.skillId)?.name ?? s.skillId);
  const idx = LEVEL_ORDER.indexOf(level);
  const nextLevel = LEVEL_ORDER[idx + 1] ?? null;
  const fallbackGrowth = nextLevel ? { builder: ["AI application development", "Automation", "Project building"], explorer: ["Applying AI to real tasks", "Automation", "Responsible AI practice"], starter: ["Prompt writing", "Using AI tools", "Checking AI outputs"], maker: ["Production reliability", "Evaluation", "Responsible AI in deployment"], pro: [] }[level] : [];
  return {
    level, nextLevel, confidence, score: Math.round((answers.filter((a) => a.correct).length / Math.max(1, answers.length)) * 100), questionsAnswered: answers.length,
    strengths: strengths.length ? strengths : ["Curiosity", "Willingness to learn"],
    growthAreas: [...growth.slice(0, 2), ...fallbackGrowth].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3),
    skillsDetected, completedAt: new Date().toISOString(),
  };
}
