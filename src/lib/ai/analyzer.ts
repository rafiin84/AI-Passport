import { COURSES } from "@/mocks/courses";
import { PROVIDERS } from "@/constants/providers";
import { SKILLS } from "@/mocks/skills";
import type { Assessment, Course, CourseAnalysis, EvidenceType, LevelId, ProviderId, Question } from "@/types";

export function detectProvider(url: string): ProviderId | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return (Object.values(PROVIDERS).find((p) => host.endsWith(p.host))?.id as ProviderId) ?? null;
  } catch {
    return null;
  }
}

export const titleFromUrl = (url: string) => {
  try {
    const slug = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
    return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim() || "Untitled course";
  } catch {
    return "Untitled course";
  }
};

const SKILL_KEYWORDS: [RegExp, string][] = [
  [/prompt/i, "prompting"], [/generative|genai|gen ai|llm/i, "generative-ai"], [/claude|copilot|cursor|coding|code/i, "ai-assisted-coding"], [/sdlc|software development lifecycle/i, "ai-sdlc"],
  [/mcp|model context/i, "mcp"], [/agent/i, "agents"], [/automat|workflow|zapier|n8n/i, "automation"], [/rag|retriev|vector/i, "rag"], [/responsible|ethic|bias|fair/i, "responsible-ai"],
  [/product|discovery/i, "product-discovery"], [/agricultur|farm|crop/i, "ai-for-agriculture"], [/health|medical|clinic/i, "ai-for-healthcare"], [/student|school|teach|education/i, "ai-for-education"],
  [/literacy|fundamental|intro|basics|primer/i, "ai-fundamentals"], [/productivity|everyday|work/i, "ai-productivity"], [/data|dataset|training/i, "data-concepts"], [/production|evaluat|deploy|engineering/i, "llm-engineering"],
  [/application|app dev|build/i, "ai-app-dev"],
];

function inferLevel(text: string): LevelId {
  if (/production|advanced|systems|engineering|expert|mlops/i.test(text)) return "pro";
  if (/agents?|application|automation|maker|build|intermediate/i.test(text) && !/beginner|basics|intro/i.test(text)) return /agents?|application/i.test(text) ? "maker" : "builder";
  if (/sdlc|claude code|essentials|foundations|builder/i.test(text)) return "builder";
  if (/prompt|students|creators|explorer/i.test(text)) return "explorer";
  return "starter";
}

export interface AnalyzeInput { url: string; title?: string; description?: string; provider?: ProviderId }

/** Deterministic stand-in for the LLM analyser. Output is a DRAFT; an admin must review it before publication. */
export function analyzeCourse(input: AnalyzeInput): CourseAnalysis {
  const known = COURSES.find((c) => c.url === input.url);
  if (known) {
    return {
      summary: known.description, suggestedLevel: known.level, skills: known.skills, categories: known.categories, domains: known.domains, audience: known.targetProfiles, ageRange: known.ageRange,
      prerequisites: known.prerequisites, learningOutcomes: known.learningOutcomes,
      assessmentApproach: "Knowledge check on core concepts, one scenario question, then a practical task.",
      practicalVerification: known.buildOutcomes[0] ?? "Apply the course methodology to a small, real task and share the result.",
      evidenceRequirements: known.evidenceTypes, verificationType: known.verificationType, confidence: 0.94,
    };
  }
  const text = `${input.title ?? titleFromUrl(input.url)} ${input.description ?? ""}`;
  const skills = [...new Set(SKILL_KEYWORDS.filter(([re]) => re.test(text)).map(([, id]) => id))].filter((id) => SKILLS.some((s) => s.id === id)).slice(0, 6);
  if (skills.length === 0) skills.push("ai-fundamentals");
  const level = inferLevel(text);
  const technical = skills.some((s) => ["ai-assisted-coding", "ai-sdlc", "mcp", "agents", "rag", "ai-app-dev", "llm-engineering"].includes(s));
  const evidence: EvidenceType[] = technical ? ["repository", "url", "demo"] : skills.includes("automation") ? ["demo", "video"] : ["screenshot"];
  const verificationType = level === "starter" ? "mcq" : technical ? "mixed" : "scenario";
  const title = input.title ?? titleFromUrl(input.url);
  return {
    summary: input.description?.trim() || `${title} — a ${level}-level course covering ${skills.map((s) => SKILLS.find((k) => k.id === s)!.name).join(", ")}. Confirm details against the provider page.`,
    suggestedLevel: level, skills,
    categories: [technical ? "AI Product Building" : "AI Fundamentals"], domains: [skills.includes("ai-for-agriculture") ? "Agriculture" : skills.includes("ai-for-healthcare") ? "Healthcare" : "General"],
    audience: technical ? ["college_student", "graduate_job_seeker", "working_professional", "entrepreneur"] : ["all"], ageRange: level === "starter" ? [15, 99] : [17, 99],
    prerequisites: level === "starter" ? [] : level === "explorer" ? ["Basic familiarity with an AI chatbot"] : ["Completed a starter or explorer course, or equivalent experience"],
    learningOutcomes: skills.slice(0, 4).map((s) => `Apply ${SKILLS.find((k) => k.id === s)!.name.toLowerCase()} to a realistic task`),
    assessmentApproach: level === "starter" ? "Short MCQ knowledge check." : "Knowledge MCQs, one scenario question and a practical task with evidence.",
    practicalVerification: technical ? "Build a small working artifact using the methodology taught, and share a live URL or repository." : "Show a real task where you applied the skill, with a note on how you checked the output.",
    evidenceRequirements: level === "starter" ? [] : evidence, verificationType, confidence: input.description ? 0.72 : 0.55,
  };
}

/** Generates a DRAFT assessment from course metadata. reviewStatus is always 'draft' until a human approves it. */
export function generateAssessment(course: Course): Assessment {
  const outcomes = course.learningOutcomes.length ? course.learningOutcomes : ["Apply the course concepts"];
  const skill = course.skills[0] ?? "ai-fundamentals";
  const distractors = ["Skip checking and rely on the tool's first answer", "Share private data so the tool has more context", "Avoid using the method taught in the course", "Wait for the provider to grade the task for you"];
  const level = course.level;
  const questions: Question[] = outcomes.slice(0, 5).map((o, i) => {
    const correct = o.replace(/^./, (c) => c.toLowerCase());
    const options = [distractors[i % 4]!, `You should be able to: ${correct}`, distractors[(i + 1) % 4]!, distractors[(i + 2) % 4]!];
    return {
      id: `gen-${course.id}-q${i + 1}`, prompt: `Which best reflects a learning goal of "${course.title}"?`, options, correctAnswer: 1,
      explanation: `The course outcome is: ${o}`, skill: course.skills[i % course.skills.length] ?? skill, topic: course.categories[0] ?? "General", domain: course.domains[0] ?? "General",
      difficulty: (LEVEL_INDEX[level] + 1) as Question["difficulty"], ageSuitability: course.ageRange, profileSuitability: course.targetProfiles, levelMapping: level,
    };
  });
  const evidence = course.evidenceTypes.length ? course.evidenceTypes : (["screenshot"] as EvidenceType[]);
  return {
    id: `gen-${course.id}`, type: "course", courseId: course.id, title: `Verify: ${course.title}`, questions,
    scenarios: [{ id: `gen-${course.id}-s1`, prompt: `You've applied what you learned in "${course.title}" and the tool gives an output that looks right but you can't confirm it. What do you do?`, options: ["Use it as-is", "Verify against a trustworthy source or test, then decide", "Delete the work", "Ask a friend to submit it for you"], correctAnswer: 1, explanation: "Verification before use is part of every skill on AI Praman." }],
    practical: course.buildOutcomes.length || course.hasProject ? {
      brief: course.buildOutcomes[0] ? `Build or demonstrate: ${course.buildOutcomes[0]}.` : `Show a real task where you applied ${course.title}.`, requiredEvidence: evidence,
      rubric: [
        { criterion: "Meets the task brief", weight: 40, description: "Deliverable does what the brief asks." },
        { criterion: "Uses course methods", weight: 30, description: "Shows techniques taught in the course." },
        { criterion: "Verification and responsibility", weight: 30, description: "Explains how output was checked and how data was protected." },
      ],
    } : null,
    difficulty: (LEVEL_INDEX[level] + 1) as Question["difficulty"], skills: course.skills, passMark: 70, generatedBy: "ai", reviewStatus: "draft", publishedAt: null,
  };
}
const LEVEL_INDEX: Record<LevelId, number> = { starter: 0, explorer: 1, builder: 2, maker: 3, pro: 4 };

export function suggestRecognitionCategory(text: string): { category: string; skills: string[]; criteria: string[] } {
  const t = text.toLowerCase();
  const map: [RegExp, string][] = [[/farm|crop|agri|mandi|kisan/, "ai-agri"], [/health|patient|doctor|asha|clinic/, "ai-health"], [/school|student|teach|learn/, "ai-education"], [/scheme|govern|citizen|yojana/, "ai-gov"], [/water|climate|flood|energy/, "ai-climate"], [/language|hindi|tamil|translate|bhasha/, "ai-lang"], [/blind|accessib|disab|screen reader/, "ai-access"], [/shop|msme|invoice|gst|small business/, "ai-msme"], [/loan|bank|upi|bookkeeping/, "ai-fin"]];
  const category = map.find(([re]) => re.test(t))?.[1] ?? "ai-innovators";
  return { category, skills: SKILL_KEYWORDS.filter(([re]) => re.test(t)).map(([, s]) => s).slice(0, 4), criteria: ["Problem relevance", "User impact", "Responsible AI", "Evidence quality"] };
}
