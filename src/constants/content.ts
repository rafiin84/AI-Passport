import { SITE } from "./site";

export const FAQ: { q: string; a: string }[] = [
  { q: "What is AI Praman?", a: "AI Praman is where you find your AI level, choose what to learn next, prove what you learned and show what you've built. It isn't a course platform — courses are hosted by other providers." },
  { q: "Who can use it?", a: "Everyone who wants to learn AI. School students aged 15 and above, college students, graduates, job seekers, working professionals and young builders are the priority audience. People outside ages 15–29 can register, take the assessment, learn and earn credentials, though some youth-specific benefits may not apply." },
  { q: "Do I need Aadhaar?", a: "In this prototype, registration is a mock Aadhaar flow. No real Aadhaar service is contacted, and only a masked reference (last four digits) is ever shown. Any real identity integration will need formal approval." },
  { q: "Is the AI Challenge an exam?", a: "No. It's a friendly, adaptive diagnostic that finds your AI level. It doesn't award any certificate." },
  { q: "How do you know I actually learned something?", a: "Finishing a course isn't enough. After you declare completion you take a short knowledge check and, for many courses, submit evidence like a live link or repository. A human reviewer checks practical work." },
  { q: "Are certificates official?", a: "Certificates in this prototype show placeholders for official identity, seal and signatory. Official credentials will only be issued once an authorised issuing authority approves the process." },
  { q: "Who writes the assessments?", a: "AI can draft assessments, but a human reviewer must approve them before they can lead to a credential." },
  { q: "How is Top 100 recognition decided?", a: "Recognition is project-first. Reviewers use a published rubric — problem relevance, quality of AI use, usefulness, innovation, impact, execution, responsible AI, evidence and scalability. Certificates and course counts don't decide rank." },
  { q: "What happens when I click a course link?", a: "You'll see a notice that you're leaving AI Praman. The provider's site, content, pricing and terms are outside our control, and no partnership is implied unless stated." },
  { q: "Is my data safe?", a: "We collect only what's needed to personalise learning and check eligibility. Public profiles show only your name, state, level, verified skills and verified projects. See the Privacy Policy." },
  { q: "How do I use AI Praman with a screen reader or larger text?", a: "Use the accessibility controls in the header or Settings for text size, high contrast, dark mode and reduced motion. The site supports keyboard navigation and screen readers." },
  { q: "Which languages are supported?", a: "English and हिन्दी today. The structure is ready for more Indian languages." },
];

export interface PolicySection { h: string; p: string[] }
export interface Policy { slug: string; title: string; summary: string; sections: PolicySection[] }

const TBD = "[Approved text to be supplied by the owning authority]";

export const POLICIES: Policy[] = [
  { slug: "privacy", title: "Privacy Policy", summary: "How AI Praman treats your information.", sections: [
    { h: "What we collect", p: ["Name, date of birth, state, city or district, education, occupation, field, AI experience, goals, interests and language preferences you enter.", "A masked Aadhaar reference (last four digits). This prototype never stores or displays a full Aadhaar number."] },
    { h: "Why we collect it", p: ["To personalise your assessment and learning path, to check age eligibility for youth programmes, and to issue and verify credentials."] },
    { h: "What is public", p: ["If you share your AI Praman, only your name, state, level, verified skills and verified projects appear. Date of birth, city, identity references and reviewer notes are never public."] },
    { h: "Evidence and projects", p: ["Evidence is submitted as links you choose to share. Reviewers see only what you submit. Internal reviewer notes are never shown to other learners."] },
    { h: "Your choices", p: ["You can edit your profile, change language and accessibility settings, and reset local prototype data at any time from Settings.", TBD] },
  ] },
  { slug: "terms", title: "Terms & Conditions", summary: "The rules for using AI Praman.", sections: [
    { h: "Use of the service", p: ["AI Praman helps you assess, discover, verify and showcase AI skills. Use it honestly and lawfully."] },
    { h: "External providers", p: ["Courses are hosted by independent providers. AI Praman doesn't control their content, pricing or terms and doesn't imply any partnership unless confirmed."] },
    { h: "Credentials", p: ["Credentials are issued only after verification steps are completed and, where required, reviewed by a person. Submitting false evidence may lead to a credential being revoked."] },
    { h: "Prototype notice", p: ["This build is a prototype. Data is illustrative and no credential issued here is an official government credential."] },
    { h: "Governing terms", p: [TBD] },
  ] },
  { slug: "copyright", title: "Copyright Policy", summary: "How content on this site can be used.", sections: [
    { h: "Site content", p: ["Unless stated otherwise, site content is owned or licensed by the owning authority. " + TBD] },
    { h: "Third-party content", p: ["Course names, logos and content belong to their respective providers and are used only to identify them."] },
    { h: "State Emblem and official marks", p: ["The State Emblem of India and other official marks may be used only from approved assets and under the rules that govern their use. This prototype shows placeholders only."] },
  ] },
  { slug: "hyperlinking", title: "Hyperlinking Policy", summary: "How we link to and from other sites.", sections: [
    { h: "Links to external sites", p: ["We link to course providers and other sites for your convenience. We clearly tell you when you are leaving AI Praman. We don't control those sites and aren't responsible for their content or availability.", "A link doesn't mean endorsement or affiliation."] },
    { h: "Links to this site", p: ["You're welcome to link to public pages of AI Praman. We don't currently restrict this. Please don't present linked pages in a way that implies you speak for the Government of India.", TBD] },
  ] },
  { slug: "grievance", title: "Grievance & Complaints", summary: "How to raise a concern.", sections: [
    { h: "Raise a grievance", p: [`Nodal officer: ${SITE.grievance.officer}`, `Email: ${SITE.grievance.email}`, `Expected response time: ${SITE.grievance.sla}`] },
    { h: "What to include", p: ["Your name, the page or credential concerned, what went wrong and how we can reach you."] },
    { h: "Status", p: ["The grievance pathway is a placeholder until the responsible officer and process are notified."] },
  ] },
];
