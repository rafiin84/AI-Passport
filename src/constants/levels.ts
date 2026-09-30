import type { LevelId } from "@/types";

export interface LevelMeta {
  id: LevelId;
  index: number;
  name: string;
  short: string;
  definition: string;
  demonstrates: string[];
  strengths: string[];
  gaps: string[];
  from: string;
  to: string;
  motivation: string;
  pathTitle: string;
}

export const LEVEL_ORDER: LevelId[] = ["starter", "explorer", "builder", "maker", "pro"];

export const LEVELS: Record<LevelId, LevelMeta> = {
  starter: {
    id: "starter", index: 0, name: "Starter", short: "Starter",
    definition: "You're at the beginning. You know AI exists and are ready to understand how it works and where it helps.",
    demonstrates: ["Recognises everyday AI", "Knows what Generative AI is", "Understands basic AI vocabulary"],
    strengths: ["Curiosity", "Fresh perspective", "Room to grow fast"],
    gaps: ["Hands-on tool use", "Writing clear prompts", "Spotting AI mistakes"],
    from: "#94a3b8", to: "#475569",
    motivation: "Every AI Pro started right here. Your first few steps will move faster than you think.",
    pathTitle: "Your path to Explorer",
  },
  explorer: {
    id: "explorer", index: 1, name: "Explorer", short: "Explorer",
    definition: "You use AI tools and can write useful prompts. You understand the limits of what AI can and cannot do.",
    demonstrates: ["Writes specific prompts", "Checks AI outputs", "Uses AI for study or work tasks"],
    strengths: ["Prompting basics", "AI tool awareness", "Healthy scepticism"],
    gaps: ["Applying AI to real projects", "Automation", "Responsible-AI practice"],
    from: "#38bdf8", to: "#0369a1",
    motivation: "You're already exploring — now it's time to point that curiosity at something real.",
    pathTitle: "Your path to Builder",
  },
  builder: {
    id: "builder", index: 2, name: "Builder", short: "Builder",
    definition: "You apply AI to real tasks and workflows. You're ready to turn knowledge into working projects.",
    demonstrates: ["Uses AI across tasks", "Structures multi-step prompts", "Reviews AI-generated work critically"],
    strengths: ["Generative AI", "Prompting", "AI productivity"],
    gaps: ["AI application development", "Automation", "Project building"],
    from: "#ffb347", to: "#e0710a",
    motivation: "You already know how to use AI tools and apply them to real tasks. Your next step is turning that knowledge into working projects.",
    pathTitle: "Your path to Maker",
  },
  maker: {
    id: "maker",  index: 3, name: "Maker", short: "Maker",
    definition: "You ship AI-powered solutions. You combine tools, data and automation to solve real problems for real people.",
    demonstrates: ["Builds working AI-assisted apps", "Designs automations and agents", "Evaluates output quality"],
    strengths: ["Building with AI", "Automation", "Problem framing"],
    gaps: ["Production reliability", "Evaluation at scale", "Responsible AI in deployment"],
    from: "#a78bfa", to: "#5b21b6",
    motivation: "You build things that work. The next leap is making them dependable enough for the whole country to rely on.",
    pathTitle: "Your path to AI Pro",
  },
  pro: {
    id: "pro", index: 4, name: "AI Pro", short: "AI Pro",
    definition: "You engineer AI systems that are reliable, evaluated and responsible — and you can teach others to do the same.",
    demonstrates: ["Designs production AI systems", "Evaluates and monitors models", "Applies responsible-AI governance"],
    strengths: ["Systems thinking", "Evaluation", "Responsible AI"],
    gaps: ["Mentoring others", "Policy-level impact", "Domain depth"],
    from: "#34d399", to: "#047857",
    motivation: "You're at the top of the framework. Now show India what you've built and help others get here.",
    pathTitle: "Keep leading",
  },
};

export const nextLevelOf = (l: LevelId): LevelId | null => LEVEL_ORDER[LEVELS[l].index + 1] ?? null;
