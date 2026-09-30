import { COURSES } from "@/mocks/courses";
import { LEVELS, LEVEL_ORDER } from "@/constants/levels";
import type { Course, LearningPath, LevelId, PathStep, User } from "@/types";

export function scoreCourse(course: Course, user: User, level: LevelId, gaps: string[]) {
  let score = 0;
  const li = LEVEL_ORDER.indexOf(level);
  const ci = LEVEL_ORDER.indexOf(course.level);
  const diff = ci - li;
  score += diff === 0 ? 3 : diff === 1 ? 4 : diff === -1 ? 1 : diff > 1 ? -2 : -1;
  score += course.skills.filter((s) => gaps.includes(s)).length * 2;
  const interestText = user.interests.join(" ").toLowerCase();
  if (course.domains.some((d) => interestText.includes(d.toLowerCase())) || course.categories.some((c) => interestText.includes(c.replace(/^AI for /, "").toLowerCase()))) score += 2;
  if (course.targetProfiles.includes("all") || course.targetProfiles.includes(user.occupationStatus)) score += 1.5; else score -= 3;
  if (user.age < course.ageRange[0] || user.age > course.ageRange[1]) score -= 6;
  if (user.goals.includes("Build my first AI project") && course.hasProject) score += 1.5;
  if (user.goals.includes("Automate my work") && course.skills.includes("automation")) score += 2;
  if (user.goals.includes("Explore AI careers") && course.level === "starter") score += 0.5;
  if (course.priceType === "free" || course.priceType === "free_audit") score += 0.5;
  if (course.featured && course.level === level) score += 1;
  return score;
}

export function recommendCourses(user: User, level: LevelId, gaps: string[] = [], exclude: string[] = [], limit = 6): Course[] {
  return COURSES.filter((c) => c.status === "published" && !exclude.includes(c.id))
    .map((c) => ({ c, s: scoreCourse(c, user, level, gaps) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.c);
}

interface StepTemplate { title: string; why: string; skillIds: string[]; }

const TEMPLATES: Record<LevelId, StepTemplate[]> = {
  starter: [
    { title: "AI Fundamentals", why: "Understand what AI is and where you already meet it.", skillIds: ["ai-fundamentals", "data-concepts"] },
    { title: "Generative AI basics", why: "See how chatbots and image tools create content.", skillIds: ["generative-ai"] },
    { title: "Responsible AI", why: "Learn to spot mistakes and protect your data.", skillIds: ["responsible-ai"] },
    { title: "Your first prompts", why: "Try AI tools with simple, safe tasks.", skillIds: ["ai-tools", "prompting"] },
  ],
  explorer: [
    { title: "Prompt Engineering", why: "Write specific prompts that give consistent results.", skillIds: ["prompting"] },
    { title: "AI for real tasks", why: "Apply AI to study or work tasks you do every week.", skillIds: ["ai-productivity", "ai-tools"] },
    { title: "Your domain, with AI", why: "See what AI can do in an area you care about.", skillIds: ["ai-for-education", "ai-for-agriculture", "ai-for-healthcare"] },
    { title: "Responsible AI", why: "Check outputs, cite honestly and respect privacy.", skillIds: ["responsible-ai"] },
    { title: "Mini project", why: "Turn what you learned into one small, useful thing.", skillIds: ["generative-ai", "automation"] },
  ],
  builder: [
    { title: "AI Fundamentals", why: "Fill any gaps in core concepts.", skillIds: ["ai-fundamentals", "generative-ai"] },
    { title: "Prompt Engineering", why: "Make prompts reliable enough to build on.", skillIds: ["prompting"] },
    { title: "AI Automation", why: "Chain tools and models into workflows that save real time.", skillIds: ["automation"] },
    { title: "Build with AI", why: "Direct AI to help you design, build and test working software.", skillIds: ["ai-sdlc", "claude-code", "ai-assisted-coding"] },
    { title: "Responsible AI", why: "Design with fairness, privacy and safety from the start.", skillIds: ["responsible-ai"] },
    { title: "Capstone Project", why: "Build and show one project that solves a real problem.", skillIds: ["ai-app-dev", "product-discovery"] },
  ],
  maker: [
    { title: "AI Application Development", why: "Ship AI-powered apps with real users.", skillIds: ["ai-app-dev"] },
    { title: "Agents & MCP", why: "Give AI safe access to tools and data.", skillIds: ["agents", "mcp"] },
    { title: "Retrieval & grounding", why: "Make answers accurate on your own data.", skillIds: ["rag"] },
    { title: "Evaluation & reliability", why: "Measure quality before you scale.", skillIds: ["llm-engineering"] },
    { title: "Responsible AI systems", why: "Audit, document and oversee AI in production.", skillIds: ["responsible-ai"] },
    { title: "Recognition-ready project", why: "Prepare a project for national recognition.", skillIds: ["ai-app-dev"] },
  ],
  pro: [
    { title: "Production AI Engineering", why: "Operate AI systems reliably.", skillIds: ["llm-engineering"] },
    { title: "Responsible AI Systems", why: "Lead governance and audits.", skillIds: ["responsible-ai"] },
    { title: "Show and mentor", why: "Submit your best project and help others level up.", skillIds: ["ai-app-dev"] },
  ],
};

export function buildPath(user: User, current: LevelId, completedCourseIds: string[], startedCourseIds: string[], gaps: string[] = []): LearningPath {
  const next = LEVEL_ORDER[LEVELS[current].index + 1] ?? current;
  const used = new Set<string>();
  const steps: PathStep[] = TEMPLATES[current].map((t, i) => {
    const candidates = COURSES.filter((c) => c.status === "published" && !used.has(c.id) && c.skills.some((s) => t.skillIds.includes(s)) && LEVEL_ORDER.indexOf(c.level) >= LEVELS[current].index - 1 && LEVEL_ORDER.indexOf(c.level) <= LEVELS[current].index + 1)
      .map((c) => ({ c, s: scoreCourse(c, user, current, gaps) + c.skills.filter((s) => t.skillIds.includes(s)).length * 2 }))
      .sort((a, b) => b.s - a.s);
    const pick = candidates[0]?.c ?? null;
    if (pick) used.add(pick.id);
    const done = !!pick && completedCourseIds.includes(pick.id);
    return { order: i + 1, title: t.title, why: t.why, skillIds: t.skillIds, courseId: pick?.id ?? null, status: done ? "done" : "upcoming" } as PathStep;
  });
  const firstOpen = steps.findIndex((s) => s.status !== "done");
  const started = steps.findIndex((s) => s.courseId && startedCourseIds.includes(s.courseId) && s.status !== "done");
  const currentIdx = started >= 0 ? started : firstOpen;
  if (currentIdx >= 0) steps[currentIdx]!.status = "current";
  return { currentLevel: current, targetLevel: next, steps };
}
