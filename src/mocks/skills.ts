import type { Skill } from "@/types";

const mk = (id: string, name: string, category: string, description: string, levels: Skill["levels"], evidenceTypes: Skill["evidenceTypes"] = ["url"]): Skill => ({ id, name, category, description, levels, evidenceTypes });

export const SKILLS: Skill[] = [
  mk("ai-fundamentals", "AI Fundamentals", "Foundations", "How AI, machine learning and data fit together, and what AI can and cannot do.", ["starter", "explorer"]),
  mk("generative-ai", "Generative AI", "Foundations", "How large language and image models generate content and where they help.", ["starter", "explorer", "builder"]),
  mk("prompting", "Prompt Engineering", "Using AI", "Writing specific, contextual prompts that produce consistent, useful results.", ["explorer", "builder", "maker"], ["url", "screenshot"]),
  mk("ai-tools", "AI Tools", "Using AI", "Choosing and using AI assistants and tools for study and work.", ["starter", "explorer", "builder"], ["screenshot"]),
  mk("ai-productivity", "AI Productivity", "Using AI", "Applying AI to save time on everyday work without losing quality.", ["explorer", "builder"], ["screenshot", "demo"]),
  mk("responsible-ai", "Responsible AI", "Ethics & Safety", "Fairness, privacy, transparency, safety and handling unsupported AI claims.", ["starter", "explorer", "builder", "maker", "pro"]),
  mk("ai-sdlc", "AI SDLC", "Building with AI", "Running the software lifecycle with AI as a collaborator, from discovery to release.", ["builder", "maker"], ["repository", "url", "demo"]),
  mk("claude-code", "Claude Code", "Building with AI", "Directing an AI coding agent to plan, write, test and refactor software.", ["builder", "maker"], ["repository", "demo"]),
  mk("ai-assisted-coding", "AI-assisted Coding", "Building with AI", "Using AI coding assistants and reviewing what they generate.", ["builder", "maker"], ["repository"]),
  mk("mcp", "Model Context Protocol", "Building with AI", "Connecting AI models to tools and data through MCP servers.", ["maker", "pro"], ["repository", "demo"]),
  mk("automation", "AI Automation", "Building with AI", "Chaining triggers, tools and models into reliable workflows.", ["builder", "maker"], ["demo", "video"]),
  mk("agents", "AI Agents", "Building with AI", "Designing agents that plan, use tools and act on multi-step goals.", ["maker", "pro"], ["repository", "demo"]),
  mk("ai-app-dev", "AI Application Development", "Building with AI", "Building user-facing products powered by AI models and APIs.", ["maker", "pro"], ["url", "repository", "demo"]),
  mk("rag", "RAG & Retrieval", "AI Engineering", "Grounding model answers in your own documents and data.", ["maker", "pro"], ["repository", "demo"]),
  mk("llm-engineering", "LLM Engineering", "AI Engineering", "Evaluation, deployment and monitoring of LLM-powered systems.", ["pro"], ["repository", "demo"]),
  mk("product-discovery", "AI Product Discovery", "Product", "Finding real user problems and deciding where AI genuinely helps.", ["builder", "maker"], ["url", "project"]),
  mk("ai-for-education", "AI for Education", "Domain Applications", "Applying AI to teaching, learning and assessment.", ["explorer", "builder"], ["project"]),
  mk("ai-for-agriculture", "AI for Agriculture", "Domain Applications", "Using AI for crop, weather, market and advisory problems.", ["explorer", "builder", "maker"], ["project"]),
  mk("ai-for-healthcare", "AI for Healthcare", "Domain Applications", "Applying AI to care access, triage support and health information — safely.", ["explorer", "builder", "maker"], ["project"]),
  mk("data-concepts", "Data & AI Concepts", "Foundations", "Training data, bias, evaluation and how data shapes model behaviour.", ["starter", "explorer", "builder"]),
];

export const skillById = (id: string) => SKILLS.find((s) => s.id === id);
export const skillName = (id: string) => skillById(id)?.name ?? id;
