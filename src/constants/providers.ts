import type { ProviderId } from "@/types";

export const PROVIDERS: Record<ProviderId, { id: ProviderId; name: string; host: string; color: string; confirmedPartner: boolean }> = {
  udemy: { id: "udemy", name: "Udemy", host: "udemy.com", color: "#a435f0", confirmedPartner: false },
  coursera: { id: "coursera", name: "Coursera", host: "coursera.org", color: "#0056d2", confirmedPartner: false },
  linkedin: { id: "linkedin", name: "LinkedIn Learning", host: "linkedin.com", color: "#0a66c2", confirmedPartner: false },
  simplilearn: { id: "simplilearn", name: "Simplilearn", host: "simplilearn.com", color: "#e8590c", confirmedPartner: false },
  futureskills: { id: "futureskills", name: "FutureSkills PRIME", host: "futureskillsprime.in", color: "#0b7a4b", confirmedPartner: false },
  indiaai: { id: "indiaai", name: "IndiaAI", host: "indiaai.gov.in", color: "#c2410c", confirmedPartner: false },
};
