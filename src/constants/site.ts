// All government-identity values are configurable placeholders.
// Replace ONLY with copy/assets supplied and approved by the authorised Government of India / IndiaAI team.
export const SITE = {
  name: "AI Passport",
  tagline: "AI skills badhao. India ko aage badhao.",
  officialDomain: process.env.NEXT_PUBLIC_OFFICIAL_DOMAIN ?? "ai-passport.gov.in", // placeholder — not a claim that the domain exists
  lastUpdated: "29 September 2026",
  ownership: {
    owningDepartment: "[Owning Ministry / Department — to be supplied]",
    indiaAiRelationship: "[IndiaAI relationship statement — to be approved]",
    contentOwnership: "[Content ownership — to be approved]",
    maintainedBy: "[Development & maintenance agency — to be approved]",
  },
  officialInitiativeBanner: "An Official Government of India Initiative",
  officialBannerAuthorised: false,
  pmMessage: {
    authorised: false,
    quote: "[Approved message of the Hon'ble Prime Minister — to be supplied with source reference]",
    source: "[Official announcement reference / date — to be supplied]",
  },
  grievance: {
    officer: "[Nodal Grievance Officer — to be notified]",
    email: "[grievance email — to be notified]",
    sla: "[Response timeline — to be notified]",
  },
  contact: {
    email: "[helpdesk email — to be notified]",
    phone: "[toll-free helpline — to be notified]",
    hours: "[Helpdesk hours — to be notified]",
  },
} as const;

export const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh",
  "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha",
  "Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh",
  "Lakshadweep","Puducherry",
];

export const EDUCATION = [
  "Class 9–10","Class 11–12","Diploma / ITI","B.Tech / B.E.","B.Sc","B.Com","B.A.","BBA / BCA","M.Tech / M.E.","MBA","M.Sc / M.A. / M.Com","PhD","Other",
];

export const OCCUPATIONS: { value: string; label: string }[] = [
  { value: "school_student", label: "School student" },
  { value: "college_student", label: "College / university student" },
  { value: "graduate_job_seeker", label: "Graduate looking for work" },
  { value: "working_professional", label: "Working professional" },
  { value: "entrepreneur", label: "Entrepreneur / builder" },
  { value: "educator", label: "Educator" },
  { value: "other", label: "Something else" },
];

export const GOALS = [
  "Understand what AI is","Explore AI careers","Get job-ready","Build my first AI project","Automate my work",
  "Start something of my own","Earn a recognised credential","Teach or mentor others",
];

export const INTERESTS = [
  "Education","Healthcare","Agriculture","Governance","Climate","Finance","Accessibility","Indian languages","Rural India","MSMEs","Creative work","Software development",
];

export const EXPERIENCE: { value: string; label: string; hint: string }[] = [
  { value: "none", label: "Brand new", hint: "I've heard of AI but haven't really used it" },
  { value: "beginner", label: "Curious user", hint: "I use chatbots now and then" },
  { value: "intermediate", label: "Regular user", hint: "AI is part of my study or work routine" },
  { value: "advanced", label: "Builder", hint: "I've built or shipped something with AI" },
];
