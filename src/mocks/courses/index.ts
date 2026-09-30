import type { Course, LevelId, ProviderId, EvidenceType, ProfileSuitability, VerificationType, CourseFormat, PriceType } from "@/types";

const ALL: ProfileSuitability[] = ["all"];
const CURATED = "2026-09-15";

const G: Record<string, [string, string, string]> = {
  amber: ["#ffb347", "#e0710a", "Lightning"],
  sky: ["#38bdf8", "#1d4ed8", "Compass"],
  violet: ["#a78bfa", "#5b21b6", "Cube"],
  green: ["#34d399", "#047857", "Leaf"],
  rose: ["#fb7185", "#9f1239", "Heartbeat"],
  slate: ["#94a3b8", "#334155", "Books"],
  teal: ["#2dd4bf", "#0f766e", "Translate"],
  indigo: ["#818cf8", "#312e81", "Robot"],
};

interface Seed {
  id: string; provider: ProviderId; title: string; instructor: string; level: LevelId; skills: string[]; categories: string[]; domains?: string[];
  hours: number; languages?: string[]; price: number; priceType: PriceType; format: CourseFormat; project?: boolean; targets?: ProfileSuitability[];
  ageRange?: [number, number]; prereq?: string[]; outcomes: string[]; builds?: string[]; description: string; verification: VerificationType; evidence?: EvidenceType[];
  assessment?: string; featured?: boolean; url?: string; theme: keyof typeof G; sections?: [string, number][];
}

const search: Record<ProviderId, (q: string) => string> = {
  udemy: (q) => `https://www.udemy.com/courses/search/?q=${encodeURIComponent(q)}`,
  coursera: (q) => `https://www.coursera.org/search?query=${encodeURIComponent(q)}`,
  linkedin: (q) => `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(q)}`,
  simplilearn: (q) => `https://www.simplilearn.com/search?query=${encodeURIComponent(q)}`,
  futureskills: () => "https://www.futureskillsprime.in/",
  indiaai: () => "https://indiaai.gov.in/",
};

const dur = (h: number) => (h < 1 ? `${Math.round(h * 60)} min` : h % 1 === 0 ? `${h} hrs` : `${h.toFixed(1)} hrs`);

function build(s: Seed): Course {
  const verified = !!s.url;
  const [from, to, icon] = G[s.theme];
  const sections = s.sections ?? [["Getting started", 4], ["Core concepts", 8], ["Hands-on practice", 7], ["Applying it", 5], ["Wrap-up project", 3]];
  return {
    id: s.id, provider: s.provider, title: s.title, url: s.url ?? search[s.provider](s.title), thumbnail: { from, to, icon },
    description: s.description, instructor: s.instructor, level: s.level, skills: s.skills, categories: s.categories, domains: s.domains ?? ["General"],
    duration: dur(s.hours), durationHours: s.hours, sections: sections.map(([title, lessons]) => ({ title, lessons })),
    languages: s.languages ?? ["English"], price: s.price, priceType: s.priceType, format: s.format, hasProject: s.project ?? false,
    targetProfiles: s.targets ?? ALL, ageRange: s.ageRange ?? [15, 99], prerequisites: s.prereq ?? [], learningOutcomes: s.outcomes,
    buildOutcomes: s.builds ?? [], verificationType: s.verification, evidenceTypes: s.evidence ?? [], verificationAssessmentId: s.assessment ?? null,
    featured: s.featured ?? false, status: "published",
    sourceMetadata: {
      urlStatus: verified ? "verified" : "provider-search", curatedOn: CURATED,
      note: verified ? "Direct course link confirmed by curators." : "Curated catalogue entry. The link opens the provider's search for this topic; price and duration are indicative and must be confirmed on the provider site.",
    },
    createdAt: "2026-08-01T09:00:00Z", updatedAt: "2026-09-15T09:00:00Z",
  };
}

const seeds: Seed[] = [
  // ---- Starter
  { id: "c-genai-primer", provider: "coursera", title: "Generative AI Primer", instructor: "Curated provider faculty", level: "starter", skills: ["generative-ai", "ai-fundamentals"], categories: ["AI Fundamentals"], hours: 3, price: 0, priceType: "free_audit", format: "Video", theme: "slate", targets: ALL, ageRange: [15, 99],
    outcomes: ["Explain what Generative AI is in plain language", "Name common uses and limits of chatbots and image tools", "Spot when an AI answer needs checking"], description: "A gentle, jargon-free introduction to Generative AI: what it is, how it produces text and images, and what to watch out for.", verification: "mcq", assessment: "va-genai-primer" },
  { id: "c-ai-literacy", provider: "futureskills", title: "AI Literacy Foundations", instructor: "FutureSkills PRIME faculty", level: "starter", skills: ["ai-fundamentals", "data-concepts", "responsible-ai"], categories: ["AI Fundamentals", "AI Literacy"], hours: 6, languages: ["English", "Hindi"], price: 0, priceType: "free", format: "Self-paced", theme: "teal",
    outcomes: ["Describe how AI learns from data", "Recognise everyday AI in India — UPI fraud checks, maps, voice assistants", "Discuss basic AI ethics"], description: "Build a solid base in AI concepts using everyday Indian examples, available in English and Hindi.", verification: "mcq", assessment: "va-ai-literacy" },
  { id: "c-ai-everyday", provider: "linkedin", title: "AI for Everyday Work", instructor: "Curated provider faculty", level: "starter", skills: ["ai-tools", "ai-productivity"], categories: ["AI Productivity"], hours: 2.5, price: 0, priceType: "subscription", format: "Video", theme: "amber", targets: ["working_professional", "graduate_job_seeker", "entrepreneur"], ageRange: [18, 99],
    outcomes: ["Draft emails and summaries with an AI assistant", "Protect confidential information when using AI", "Decide which tasks suit AI"], description: "Practical ways to use AI assistants for the small tasks that eat up your day.", verification: "mcq" },
  { id: "c-resp-intro", provider: "indiaai", title: "Introduction to Responsible AI", instructor: "IndiaAI learning initiative", level: "starter", skills: ["responsible-ai", "ai-fundamentals"], categories: ["Responsible AI"], hours: 2, languages: ["English", "Hindi"], price: 0, priceType: "free", format: "Text + labs", theme: "green",
    outcomes: ["Explain fairness, privacy and transparency in AI", "Recognise bias in an AI output", "Know how to report an AI harm"], description: "Why responsible AI matters for India and how to start practising it from day one.", verification: "mcq", assessment: "va-resp-intro" },
  // ---- Explorer
  { id: "c-prompt-basics", provider: "coursera", title: "Generative AI: Prompt Engineering Basics", instructor: "Curated provider faculty", level: "explorer", skills: ["prompting", "generative-ai"], categories: ["Prompt Engineering"], hours: 7, price: 0, priceType: "free_audit", format: "Video", project: true, theme: "sky",
    prereq: ["Basic familiarity with a chatbot"], outcomes: ["Write specific prompts with role, context and format", "Iterate on prompts to improve consistency", "Build a small prompt library"], builds: ["A personal prompt library for study or work"], description: "Learn the core patterns behind effective prompts and practise until your results are consistent.", verification: "mixed", evidence: ["screenshot", "url"], assessment: "va-prompt-basics" },
  { id: "c-prompt-beginners", provider: "udemy", title: "Prompt Engineering for Beginners", instructor: "Curated provider faculty", level: "explorer", skills: ["prompting", "ai-tools"], categories: ["Prompt Engineering"], hours: 4.5, price: 499, priceType: "paid", format: "Video", theme: "violet",
    outcomes: ["Choose the right tool for a task", "Structure prompts for clearer answers", "Check outputs for errors and made-up facts"], description: "Hands-on prompt techniques for anyone starting with AI assistants.", verification: "mcq" },
  { id: "c-ai-students", provider: "futureskills", title: "AI for Students", instructor: "FutureSkills PRIME faculty", level: "explorer", skills: ["ai-tools", "ai-for-education", "responsible-ai"], categories: ["AI for Education"], domains: ["Education"], hours: 8, languages: ["English", "Hindi"], price: 0, priceType: "free", format: "Self-paced", theme: "amber", targets: ["school_student", "college_student"], ageRange: [15, 25], project: true,
    outcomes: ["Use AI to study without copying", "Cite and verify AI-assisted work", "Plan a mini research project with AI"], builds: ["An AI-assisted study planner"], description: "Use AI to learn better — honestly and effectively — with examples from Indian school and college life.", verification: "mixed", evidence: ["screenshot"], assessment: "va-ai-students" },
  { id: "c-ai-creators", provider: "linkedin", title: "AI for Creators", instructor: "Curated provider faculty", level: "explorer", skills: ["generative-ai", "ai-tools", "ai-productivity"], categories: ["AI for Creators"], domains: ["Creative"], hours: 3.5, price: 0, priceType: "subscription", format: "Video", theme: "rose", targets: ["college_student", "entrepreneur", "graduate_job_seeker"],
    outcomes: ["Plan content with AI", "Generate and refine visuals responsibly", "Disclose AI use to your audience"], description: "A creator's toolkit for scripts, thumbnails and workflows powered by AI.", verification: "mcq" },
  // ---- Builder
  { id: "c-ai-sdlc", provider: "udemy", title: "AI SDLC: Building with Claude Code on Zoho Cloud", instructor: "Instructor as listed on Udemy", level: "builder",
    skills: ["ai-sdlc", "claude-code", "ai-assisted-coding", "product-discovery", "mcp"], categories: ["AI-assisted Coding", "AI Product Building"], domains: ["Software"], hours: 9, price: 0, priceType: "paid", format: "Project-based", project: true, featured: true, theme: "amber",
    url: "https://www.udemy.com/course/ai-sdlc-building-with-claude-code-on-zoho-cloud", targets: ["college_student", "graduate_job_seeker", "working_professional", "entrepreneur"], ageRange: [17, 99],
    prereq: ["Basic web development familiarity", "Comfort using a terminal"],
    sections: [["Product discovery with AI", 6], ["Designing user journeys and the AI SDLC", 7], ["Claude Code fundamentals", 8], ["MCP: connecting tools and data", 6], ["Building the frontend in React", 9], ["Backend, OAuth and Zoho Cloud", 8], ["Testing and reviewing AI-written code", 6], ["Ship it: deployment and demo", 4]],
    outcomes: ["Run a product from discovery to release with an AI-assisted SDLC", "Direct Claude Code to plan, build and test software", "Connect tools and data with MCP", "Separate frontend from backend responsibilities", "Add OAuth and deploy on Zoho Cloud", "Review and test AI-generated code before it ships"],
    builds: ["A small AI-assisted web application built end to end", "A React frontend with a Zoho Cloud backend and OAuth sign-in", "A demo you can show in your AI Passport"],
    description: "Learn a repeatable methodology for building real software with AI: discover the problem, design journeys, direct Claude Code, connect tools with MCP, build a React frontend, add OAuth and deploy on Zoho Cloud.",
    verification: "mixed", evidence: ["url", "repository", "demo", "screenshot"], assessment: "va-ai-sdlc" },
  { id: "c-genai-essentials", provider: "coursera", title: "Generative AI Essentials", instructor: "Curated provider faculty", level: "builder", skills: ["generative-ai", "prompting", "ai-productivity"], categories: ["Generative AI"], hours: 10, price: 0, priceType: "free_audit", format: "Video", project: true, theme: "violet",
    prereq: ["Prompt basics"], outcomes: ["Compare models and pick one for a task", "Build multi-step prompt workflows", "Evaluate output quality with a simple rubric"], builds: ["A workflow that automates a weekly task"], description: "Go beyond single prompts: chain steps, compare models and judge quality.", verification: "mixed", evidence: ["screenshot", "demo"], assessment: "va-genai-essentials" },
  { id: "c-genai-prompt-foundations", provider: "simplilearn", title: "GenAI Foundations and Prompt Engineering", instructor: "Curated provider faculty", level: "builder", skills: ["generative-ai", "prompting", "data-concepts"], categories: ["Generative AI", "Prompt Engineering"], hours: 12, price: 2999, priceType: "paid", format: "Live cohort", theme: "indigo",
    outcomes: ["Explain how LLMs work at a working level", "Design reusable prompt templates", "Apply GenAI to a work scenario"], description: "A structured programme mixing GenAI theory with live prompt labs.", verification: "mcq" },
  { id: "c-ai-automation", provider: "udemy", title: "AI Automation Foundations", instructor: "Curated provider faculty", level: "builder", skills: ["automation", "ai-productivity", "ai-tools"], categories: ["AI Automation"], hours: 6.5, price: 549, priceType: "paid", format: "Project-based", project: true, theme: "teal", targets: ["working_professional", "entrepreneur", "graduate_job_seeker"], ageRange: [18, 99],
    outcomes: ["Map a process that AI can automate", "Chain triggers, tools and models", "Add human review to automations"], builds: ["An automated report or lead-handling workflow"], description: "Automate real tasks by combining no-code tools with AI models.", verification: "mixed", evidence: ["demo", "video"], assessment: "va-ai-automation" },
  // ---- Maker
  { id: "c-genai-prompt-maker", provider: "coursera", title: "Generative AI & Prompt Engineering", instructor: "Curated provider faculty", level: "maker", skills: ["prompting", "generative-ai", "ai-app-dev"], categories: ["Prompt Engineering", "Generative AI"], hours: 16, price: 0, priceType: "free_audit", format: "Video", project: true, theme: "violet",
    prereq: ["Prompt Engineering basics", "Some programming"], outcomes: ["Design prompt chains for products", "Use structured outputs and tool calls", "Test prompts systematically"], builds: ["A prompt-driven feature for an app"], description: "Take prompt engineering into product territory with structured outputs, tools and tests.", verification: "mixed", evidence: ["repository", "demo"] },
  { id: "c-ai-app-dev", provider: "udemy", title: "AI Application Development", instructor: "Curated provider faculty", level: "maker", skills: ["ai-app-dev", "ai-assisted-coding", "rag"], categories: ["AI Product Building"], domains: ["Software"], hours: 14, price: 649, priceType: "paid", format: "Project-based", project: true, theme: "sky", targets: ["college_student", "graduate_job_seeker", "working_professional", "entrepreneur"], ageRange: [18, 99],
    prereq: ["Basic programming"], outcomes: ["Call model APIs from a web app", "Add retrieval over your own documents", "Handle errors, cost and latency"], builds: ["A working AI-powered web app"], description: "Build and ship an AI-powered product with APIs, retrieval and a real user interface.", verification: "mixed", evidence: ["url", "repository"], assessment: "va-ai-app-dev" },
  { id: "c-agents", provider: "linkedin", title: "AI Agents and Automation", instructor: "Curated provider faculty", level: "maker", skills: ["agents", "automation", "mcp"], categories: ["Agents", "AI Automation"], hours: 5, price: 0, priceType: "subscription", format: "Video", project: true, theme: "indigo",
    prereq: ["AI Automation basics"], outcomes: ["Explain what makes something an agent", "Give agents tools safely", "Add guardrails and human approval"], builds: ["A tool-using agent for a small workflow"], description: "How agents plan and act, and how to keep them useful and safe.", verification: "mixed", evidence: ["demo", "repository"] },
  { id: "c-ai-industry", provider: "futureskills", title: "AI for Industry", instructor: "FutureSkills PRIME faculty", level: "maker", skills: ["ai-app-dev", "automation", "responsible-ai"], categories: ["Domain Applications"], domains: ["Manufacturing", "MSME"], hours: 20, languages: ["English", "Hindi"], price: 0, priceType: "free", format: "Text + labs", project: true, theme: "green", targets: ["working_professional", "entrepreneur"],
    outcomes: ["Find AI use cases in an MSME or factory setting", "Estimate value and risk", "Pilot a small AI solution"], builds: ["An AI pilot proposal for an Indian MSME"], description: "Apply AI to real industry and MSME problems, with case studies from Indian sectors.", verification: "mixed", evidence: ["project", "url"] },
  // ---- Pro
  { id: "c-llm-engineering", provider: "coursera", title: "LLM Application Engineering", instructor: "Curated provider faculty", level: "pro", skills: ["llm-engineering", "rag", "ai-app-dev"], categories: ["AI Engineering"], hours: 24, price: 3900, priceType: "subscription", format: "Project-based", project: true, theme: "indigo",
    prereq: ["AI Application Development or equivalent"], outcomes: ["Design evaluation suites for LLM features", "Optimise cost and latency", "Monitor quality in production"], builds: ["An evaluated, monitored LLM service"], description: "Engineer LLM applications with proper evaluation, observability and cost control.", verification: "practical", evidence: ["repository", "demo"] },
  { id: "c-rag-systems", provider: "udemy", title: "RAG and AI Systems", instructor: "Curated provider faculty", level: "pro", skills: ["rag", "llm-engineering", "agents"], categories: ["AI Engineering"], hours: 15, price: 699, priceType: "paid", format: "Project-based", project: true, theme: "teal",
    prereq: ["Working knowledge of APIs"], outcomes: ["Choose chunking and retrieval strategies", "Evaluate retrieval quality", "Combine RAG with agents"], builds: ["A retrieval system over Indian-language documents"], description: "Design retrieval-augmented systems that stay accurate as data grows.", verification: "practical", evidence: ["repository", "demo"] },
  { id: "c-prod-ai", provider: "simplilearn", title: "Production AI Engineering", instructor: "Curated provider faculty", level: "pro", skills: ["llm-engineering", "ai-sdlc", "responsible-ai"], categories: ["AI Engineering"], hours: 30, price: 24999, priceType: "paid", format: "Live cohort", project: true, theme: "slate",
    prereq: ["Production software experience"], outcomes: ["Ship and operate AI services", "Set up evaluation pipelines", "Handle incidents and rollbacks"], builds: ["A production-ready AI service with runbook"], description: "A cohort programme on running AI systems reliably in production.", verification: "practical", evidence: ["repository", "url"] },
  { id: "c-resp-systems", provider: "indiaai", title: "Responsible AI Systems", instructor: "IndiaAI learning initiative", level: "pro", skills: ["responsible-ai", "llm-engineering", "data-concepts"], categories: ["Responsible AI"], hours: 10, languages: ["English", "Hindi"], price: 0, priceType: "free", format: "Text + labs", project: true, theme: "green",
    outcomes: ["Run a bias and safety audit", "Document a system with model cards", "Design human oversight"], builds: ["A responsible-AI audit for a public-service use case"], description: "Governance, audits and documentation for AI systems that serve the public.", verification: "practical", evidence: ["project", "url"] },
  // ---- Domain extras
  { id: "c-agri-ai", provider: "indiaai", title: "AI for Agriculture: Smarter Farm Decisions", instructor: "IndiaAI learning initiative", level: "explorer", skills: ["ai-for-agriculture", "data-concepts"], categories: ["AI for Agriculture"], domains: ["Agriculture"], hours: 5, languages: ["English", "Hindi"], price: 0, priceType: "free", format: "Self-paced", project: true, theme: "green", targets: ALL,
    outcomes: ["Describe AI uses in weather, crop and market advisory", "Read a crop-advisory AI output critically", "Sketch an AI idea for a local farming problem"], builds: ["A one-page AI idea for a farm problem"], description: "How AI supports farmers today and how you could help build what comes next.", verification: "scenario", assessment: "va-agri-ai" },
  { id: "c-health-ai", provider: "coursera", title: "AI in Healthcare: Access and Safety", instructor: "Curated provider faculty", level: "builder", skills: ["ai-for-healthcare", "responsible-ai"], categories: ["AI for Healthcare"], domains: ["Healthcare"], hours: 8, price: 0, priceType: "free_audit", format: "Video", theme: "rose", targets: ALL, ageRange: [18, 99],
    outcomes: ["Identify safe and unsafe AI health uses", "Explain limits of AI triage support", "Design a privacy-first health information tool"], description: "Where AI can widen access to care — and where it must never replace a clinician.", verification: "scenario" },
  { id: "c-indic-ai", provider: "futureskills", title: "AI in Indian Languages", instructor: "FutureSkills PRIME faculty", level: "builder", skills: ["generative-ai", "ai-app-dev", "data-concepts"], categories: ["AI for Indian Languages"], domains: ["Language"], hours: 6, languages: ["English", "Hindi"], price: 0, priceType: "free", format: "Self-paced", project: true, theme: "teal",
    outcomes: ["Explain why Indian languages are harder for AI", "Test a model in two Indian languages", "Design a voice-first interface"], builds: ["A small multilingual assistant prototype"], description: "Explore translation, speech and text AI for India's languages and build something multilingual.", verification: "mixed", evidence: ["demo"] },
];

export const COURSES: Course[] = seeds.map(build);
export const courseById = (id: string) => COURSES.find((c) => c.id === id);
export const FEATURED_COURSE_ID = "c-ai-sdlc";
