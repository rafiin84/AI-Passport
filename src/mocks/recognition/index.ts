import type { Recognition, RecognitionCategory, RubricCriterion } from "@/types";

export const RUBRIC: RubricCriterion[] = [
  { id: "relevance", label: "Problem relevance", weight: 15 },
  { id: "quality", label: "AI application quality", weight: 15 },
  { id: "usefulness", label: "Practical usefulness", weight: 15 },
  { id: "innovation", label: "Innovation", weight: 10 },
  { id: "impact", label: "User impact", weight: 15 },
  { id: "execution", label: "Technical execution", weight: 10 },
  { id: "responsible", label: "Responsible AI", weight: 10 },
  { id: "evidence", label: "Evidence quality", weight: 5 },
  { id: "scalability", label: "Scalability / reusability", weight: 5 },
];

const cat = (id: string, name: string, icon: string, description: string, status: RecognitionCategory["status"] = "published"): RecognitionCategory => ({ id, name, icon, description, status, year: 2027 });

export const CATEGORIES: RecognitionCategory[] = [
  cat("ai-education", "AI for Education", "GraduationCap", "Projects that help people teach, learn or assess better."),
  cat("ai-health", "AI for Healthcare", "Heartbeat", "Projects that widen access to safe health information and care."),
  cat("ai-agri", "AI for Agriculture", "Plant", "Projects that help farmers decide, sell and grow better."),
  cat("ai-gov", "AI for Governance", "Bank", "Projects that make public services easier to reach and understand."),
  cat("ai-climate", "AI for Climate", "CloudSun", "Projects that help communities adapt to and reduce climate impact."),
  cat("ai-fin", "AI for Financial Inclusion", "Coins", "Projects that bring money management within reach of more people."),
  cat("ai-access", "AI for Accessibility", "Wheelchair", "Projects that remove barriers for people with disabilities."),
  cat("ai-lang", "AI for Indian Languages", "Translate", "Projects that make AI work in India's many languages."),
  cat("ai-rural", "AI for Rural India", "House", "Projects designed for and with rural communities."),
  cat("ai-msme", "AI for MSMEs", "Storefront", "Projects that help small businesses save time and earn more."),
  cat("ai-builders", "AI Builders", "Hammer", "Well-built AI products with strong engineering."),
  cat("ai-creators", "AI Creators", "PaintBrush", "Creative work made with AI, responsibly disclosed."),
  cat("ai-entrepreneurs", "AI Entrepreneurs", "RocketLaunch", "Ventures using AI to serve a real market."),
  cat("ai-innovators", "AI Innovators", "Lightbulb", "Original ideas that push what AI can do for India."),
  cat("ai-allrounders", "AI All-Rounders", "Star", "Learners who combine verified skills with impactful projects."),
];

const b = (v: number) => ({ relevance: v, quality: v, usefulness: v, innovation: v - 1, impact: v, execution: v - 1, responsible: v, evidence: v - 1, scalability: v - 2 });

// [id, category, rank, userId, projectId, score, status]
const seeds: [string, string, number, string, string, number, Recognition["status"]][] = [
  ["r1", "ai-education", 1, "u-lakshmi", "p-pathshala", 92, "published"],
  ["r2", "ai-education", 2, "u-aarav", "p-shikshak", 84, "shortlisted"],
  ["r3", "ai-agri", 1, "u-ananya", "p-kisan", 94, "published"],
  ["r4", "ai-agri", 2, "u-gurpreet", "p-mandi", 88, "published"],
  ["r5", "ai-health", 1, "u-kavya", "p-swasthya", 90, "published"],
  ["r6", "ai-health", 2, "u-sneha", "p-aasha", 79, "shortlisted"],
  ["r7", "ai-lang", 1, "u-rohan", "p-bhashini", 93, "published"],
  ["r8", "ai-access", 1, "u-fatima", "p-sugamya", 89, "published"],
  ["r9", "ai-msme", 1, "u-imran", "p-udyam", 87, "published"],
  ["r10", "ai-climate", 1, "u-biswajit", "p-jal", 80, "shortlisted"],
  ["r11", "ai-gov", 1, "u-tenzin", "p-sarkari", 78, "shortlisted"],
];

export const RECOGNITIONS: Recognition[] = seeds.map(([id, category, rank, userId, projectId, rubricScore, status]) => ({
  id, category, year: 2027, rank, userId, projectId, rubricScore, rubricBreakdown: b(Math.round(rubricScore / 10)), status,
  reviewerNotes: "Internal — strong evidence of real-world use. Confirm user consent for named testimonials before publication.",
}));
