import type { Assessment, Difficulty, EvidenceType, LevelId, Question } from "@/types";

type Q = [prompt: string, options: string[], correct: number, explanation: string];
type Scn = [prompt: string, options: string[], correct: number, explanation: string];

function make(
  id: string, courseId: string, title: string, level: LevelId, skill: string, diff: Difficulty, qs: Q[], scn: Scn[],
  brief: string | null, evidence: EvidenceType[], rubric: [string, number, string][] = [],
): Assessment {
  const questions: Question[] = qs.map(([prompt, options, correctAnswer, explanation], i) => ({
    id: `${id}-q${i + 1}`, prompt, options, correctAnswer, explanation, skill, topic: title, domain: "Course", difficulty: diff,
    ageSuitability: [15, 99], profileSuitability: ["all"], levelMapping: level,
  }));
  return {
    id, type: "course", courseId, title: `Verify: ${title}`, questions,
    scenarios: scn.map(([prompt, options, correctAnswer, explanation], i) => ({ id: `${id}-s${i + 1}`, prompt, options, correctAnswer, explanation })),
    practical: brief ? { brief, requiredEvidence: evidence, rubric: rubric.map(([criterion, weight, description]) => ({ criterion, weight, description })) } : null,
    difficulty: diff, skills: [skill], passMark: 70, generatedBy: "ai", reviewStatus: "approved", publishedAt: "2026-09-10T09:00:00Z",
  };
}

export const VERIFICATION_ASSESSMENTS: Assessment[] = [
  make("va-ai-sdlc", "c-ai-sdlc", "AI SDLC: Building with Claude Code on Zoho Cloud", "builder", "ai-sdlc", 3, [
    ["In an AI SDLC, what should happen BEFORE you ask Claude Code to write features?", ["Deploy to production", "Clarify the user problem, journeys and acceptance criteria", "Choose a colour palette", "Delete the existing tests"], 1, "Discovery and clear journeys give the agent a precise target and make the result reviewable."],
    ["What is the main value of user journeys in AI-assisted development?", ["They make the code shorter", "They describe what users must be able to do so features and tests map back to real needs", "They replace the need for testing", "They pick the database"], 1, "Journeys anchor features to real user outcomes."],
    ["What does MCP let an AI coding agent do?", ["Compile code faster", "Connect to external tools and data sources through a standard protocol", "Avoid writing tests", "Host websites"], 1, "MCP standardises connections between agents and tools/data."],
    ["Which correctly separates frontend and backend responsibilities?", ["Frontend stores secrets; backend renders buttons", "Frontend handles UI and interaction; backend holds business logic, data and secrets", "They are identical", "Backend only handles colours"], 1, "Secrets and trusted logic belong on the server side; the browser handles presentation and interaction."],
    ["Why does OAuth matter when connecting your app to Zoho Cloud?", ["It makes pages load faster", "It lets users grant your app scoped access without sharing their password", "It removes the need for HTTPS", "It generates UI components"], 1, "OAuth delegates limited, revocable access using tokens rather than passwords."],
    ["What is the right stance on AI-written code?", ["Trust it because it compiled", "Review it, run tests and check security before merging", "Only review the first file", "Never use it"], 1, "AI output must be reviewed and tested like any teammate's code."],
  ], [
    ["Claude Code proposes a change that touches five files and passes no tests. What do you do?", ["Merge — it's from AI", "Ask it to add or run tests, review the diff, and merge only after checks pass", "Revert the whole repository", "Ignore the diff"], 1, "Ask for tests, review the diff and merge on evidence."],
  ], "Build a small AI-assisted web application using the methodology taught in the course.", ["url", "repository", "demo", "screenshot"], [
    ["Problem clarity", 20, "The app targets a clearly stated user problem with defined journeys."],
    ["AI-assisted process", 25, "Evidence shows discovery, planning and iteration with an AI coding agent."],
    ["Working software", 25, "The live URL or demo works end to end."],
    ["Code quality and testing", 20, "Repository shows structure, tests and review of AI-generated code."],
    ["Responsible practice", 10, "Secrets are protected and AI use is disclosed."],
  ]),
  make("va-genai-primer", "c-genai-primer", "Generative AI Primer", "starter", "generative-ai", 1, [
    ["Generative AI mainly…", ["Creates new content from patterns it learned", "Deletes files", "Only translates numbers", "Replaces the internet"], 0, "It generates new text, images or code."],
    ["Why can a chatbot state something false confidently?", ["It predicts likely text and does not verify facts", "It wants to trick you", "It is broken", "It has no data"], 0, "Fluent text is not the same as verified truth."],
    ["Which is safest to paste into a public chatbot?", ["Your Aadhaar number", "A general question about photosynthesis", "Your bank OTP", "A private medical report"], 1, "Never share identity, financial or medical data with public tools."],
    ["Best habit when using AI answers?", ["Check important facts elsewhere", "Never check", "Share immediately", "Delete them"], 0, "Verify anything that matters."],
  ], [], null, []),
  make("va-ai-literacy", "c-ai-literacy", "AI Literacy Foundations", "starter", "ai-fundamentals", 1, [
    ["How does most modern AI learn?", ["From examples in data", "By reading minds", "By copying passwords", "From nothing"], 0, "It finds patterns in data."],
    ["Which is AI in daily Indian life?", ["Fraud alerts on digital payments", "A steel almirah", "A ceiling fan", "A wall calendar"], 0, "Payment fraud detection uses learned patterns."],
    ["Biased training data can cause…", ["Unfair outputs", "Faster internet", "Better weather", "Lower prices"], 0, "Skewed data can produce skewed outcomes."],
    ["An AI 'model' is…", ["A learned system that maps inputs to outputs", "A physical robot", "A website", "A file folder"], 0, "It's the learned mathematical function."],
  ], [], null, []),
  make("va-resp-intro", "c-resp-intro", "Introduction to Responsible AI", "starter", "responsible-ai", 1, [
    ["Which is a responsible-AI principle?", ["Fairness", "Secrecy at any cost", "Speed only", "Ignoring users"], 0, "Fairness is core alongside privacy, transparency and safety."],
    ["An AI output seems to treat a group unfairly. First step?", ["Report and document it", "Hide it", "Ignore it", "Share it as fact"], 0, "Flag and document so it can be fixed."],
    ["Transparency means…", ["People can understand when and how AI is used", "Using clear glass devices", "Hiding data", "Using open Wi-Fi"], 0, "Being open about AI use and limits."],
    ["Personal data should be…", ["Collected only as needed and protected", "Collected always", "Posted publicly", "Sold"], 0, "Data minimisation and protection."],
  ], [], null, []),
  make("va-prompt-basics", "c-prompt-basics", "Prompt Engineering Basics", "explorer", "prompting", 2, [
    ["A strong prompt usually includes…", ["Task, context, audience and format", "Only one word", "Only emojis", "A random quote"], 0, "Those four elements steer the output."],
    ["To improve a weak answer you should…", ["Iterate: refine the prompt with what was missing", "Give up", "Repeat the same words", "Switch off the computer"], 0, "Iteration is normal."],
    ["Giving an example in a prompt helps because…", ["It shows the pattern you want", "It costs less", "It hides errors", "It deletes context"], 0, "Few-shot examples anchor the style."],
    ["Which prompt is best for a Class 10 science summary?", ["Summarise chapter", "Summarise Class 10 'Life Processes' in 6 bullets with one everyday Indian example each", "Science", "Do my homework"], 1, "Specific level, length and examples."],
  ], [
    ["Your prompt gives inconsistent formats each run. Best fix?", ["Specify an output template and one example", "Make it longer with no structure", "Use all capitals", "Run it ten times"], 0, "A fixed template plus example stabilises format."],
  ], "Create a small prompt library (at least 5 prompts) for study or work and show before/after results.", ["screenshot", "url"], [
    ["Prompt structure", 40, "Prompts specify task, context and format."], ["Iteration evidence", 40, "Shows improvement from a weaker version."], ["Verification", 20, "Notes how outputs were checked."],
  ]),
  make("va-ai-students", "c-ai-students", "AI for Students", "explorer", "ai-for-education", 2, [
    ["Best way to use AI for homework?", ["Ask it to explain, then attempt it yourself", "Submit its output as yours", "Ask it to fake citations", "Avoid learning"], 0, "AI should support learning, not replace it."],
    ["If an AI gives a reference, you should…", ["Confirm it exists and says what is claimed", "Trust it", "Copy it blindly", "Ignore all sources"], 0, "AI can invent references."],
    ["Using AI in an assignment, the honest approach is to…", ["Follow your school's rules and disclose", "Hide it", "Blame a friend", "Delete the record"], 0, "Follow institutional rules and disclose use."],
    ["A good study use of AI:", ["Generate practice questions and check answers with your book", "Skip revision", "Skip class", "Copy answers"], 0, "Active recall with verification."],
  ], [], "Share a screenshot of your AI-assisted study planner and a short note on how you checked its advice.", ["screenshot"], [
    ["Usefulness", 50, "Plan is realistic for the learner."], ["Honest use", 50, "Notes verification and disclosure."],
  ]),
  make("va-genai-essentials", "c-genai-essentials", "Generative AI Essentials", "builder", "generative-ai", 3, [
    ["Why chain prompts into a workflow?", ["Complex tasks are more reliable when broken into checked steps", "It always saves money", "It removes review", "It hides errors"], 0, "Decomposition improves reliability."],
    ["A fair way to compare two models for your task:", ["Run the same test set and score with a rubric", "Pick the one with the best logo", "Ask each once", "Use the cheapest"], 0, "Consistent test set and rubric."],
    ["What should a quality rubric for AI output include?", ["Accuracy, relevance, tone, completeness", "Colour", "Length only", "Speed only"], 0, "Multiple dimensions of quality."],
    ["When should a human review AI output?", ["Whenever errors would matter", "Never", "Only for images", "Only on weekends"], 0, "Risk determines review."],
  ], [], "Demonstrate a multi-step workflow that automates a weekly task, with a screenshot or demo.", ["screenshot", "demo"], [
    ["Workflow design", 40, "Clear steps with human checkpoints."], ["Quality evaluation", 40, "Uses a simple rubric."], ["Time saved", 20, "Explains the benefit."],
  ]),
  make("va-ai-automation", "c-ai-automation", "AI Automation Foundations", "builder", "automation", 3, [
    ["A good candidate for automation is…", ["A repetitive, rules-plus-language task with clear success criteria", "A one-off decision with life-or-death stakes", "Anything at all", "Tasks nobody understands"], 0, "Repetitive and well-defined."],
    ["Why add a human approval step?", ["To catch edge cases and errors before they matter", "To slow things down", "To avoid logging", "To remove triggers"], 0, "Humans handle exceptions."],
    ["What is a trigger?", ["The event that starts a workflow", "A password", "A prompt style", "A database"], 0, "Triggers start automations."],
    ["If an automation fails silently, you need…", ["Logging and alerts", "More triggers", "A bigger model", "Nothing"], 0, "Observability."],
  ], [], "Record a short demo of an automation you built, with a note on where a human reviews.", ["demo", "video"], [
    ["Works end to end", 50, "Automation runs from trigger to output."], ["Human checkpoint", 30, "Review step is explicit."], ["Clarity", 20, "Explains purpose."],
  ]),
  make("va-ai-app-dev", "c-ai-app-dev", "AI Application Development", "maker", "ai-app-dev", 4, [
    ["Why keep API keys on the server?", ["Browsers can expose them to anyone", "Servers are faster", "Keys expire quicker", "It looks cleaner"], 0, "Client code is visible to users."],
    ["Retrieval helps an app by…", ["Grounding answers in your documents", "Making the model larger", "Removing the UI", "Deleting data"], 0, "Grounding with your data."],
    ["To control cost you can…", ["Cache results, limit tokens, choose right-sized models", "Ignore usage", "Increase temperature", "Disable errors"], 0, "Practical cost controls."],
    ["Good error handling includes…", ["Graceful fallbacks and clear user messages", "Crashing", "Silent retries forever", "Hiding logs"], 0, "Reliability."],
  ], [], "Ship a working AI-powered web app and share the live URL and repository.", ["url", "repository"], [
    ["Working product", 35, "Live URL works."], ["AI integration quality", 25, "Model use is purposeful."], ["Engineering quality", 25, "Repo structure and tests."], ["Responsible AI", 15, "Handles limits and privacy."],
  ]),
  make("va-agri-ai", "c-agri-ai", "AI for Agriculture", "explorer", "ai-for-agriculture", 2, [
    ["AI advisory for farmers should be…", ["Local, timely and checkable", "Generic and vague", "Only in English", "Unverified"], 0, "Relevance and language matter."],
    ["Which data helps crop advisory?", ["Weather, soil, satellite and market data", "Lottery numbers", "Movie ratings", "Phone brands"], 0, "Domain data."],
  ], [
    ["An AI tool advises spraying pesticide right before heavy rain forecast. You should…", ["Verify with local agri-extension guidance and weather before acting", "Follow blindly", "Ignore weather", "Post it publicly"], 0, "Verify high-stakes advice with local experts."],
    ["A model works in one district but not another. Next step?", ["Check whether training data covers the new conditions", "Blame farmers", "Do nothing", "Increase font size"], 0, "Data representativeness."],
  ], null, []),
];

export const assessmentForCourse = (courseId: string) => VERIFICATION_ASSESSMENTS.find((a) => a.courseId === courseId) ?? null;
