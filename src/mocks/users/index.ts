import type { AiExperience, LevelId, OccupationStatus, User } from "@/types";

const NOW = "2026-09-29T09:00:00Z";
type Seed = [id: string, name: string, dob: string, age: number, state: string, city: string, education: string, occ: OccupationStatus, field: string, exp: AiExperience, level: LevelId | null, goals: string[], interests: string[], lang: "en" | "hi", hue: number];

const seeds: Seed[] = [
  ["u-aarav", "Aarav Mehta", "2005-03-14", 21, "Karnataka", "Bengaluru", "B.Tech / B.E.", "college_student", "Computer Science", "intermediate", "builder", ["Build my first AI project", "Get job-ready"], ["Software development", "Education"], "en", 32],
  ["u-priya", "Priya Nair", "2003-07-22", 23, "Kerala", "Kochi", "B.Com", "graduate_job_seeker", "Commerce & Finance", "beginner", "explorer", ["Get job-ready", "Automate my work"], ["Finance", "MSMEs"], "en", 340],
  ["u-arjun", "Arjun Singh", "2009-01-09", 17, "Uttar Pradesh", "Lucknow", "Class 11–12", "school_student", "Science", "none", "starter", ["Understand what AI is", "Explore AI careers"], ["Education", "Creative work"], "hi", 210],
  ["u-ananya", "Ananya Iyer", "2002-11-03", 23, "Tamil Nadu", "Coimbatore", "B.Tech / B.E.", "working_professional", "Electronics", "advanced", "maker", ["Start something of my own", "Earn a recognised credential"], ["Agriculture", "Rural India"], "en", 150],
  ["u-imran", "Imran Sheikh", "2001-05-18", 25, "Maharashtra", "Pune", "MBA", "entrepreneur", "Operations", "advanced", "maker", ["Start something of my own"], ["MSMEs", "Finance"], "en", 20],
  ["u-kavya", "Kavya Reddy", "2004-02-27", 22, "Telangana", "Hyderabad", "B.Sc", "college_student", "Data Science", "intermediate", "builder", ["Build my first AI project"], ["Healthcare", "Accessibility"], "en", 280],
  ["u-rohan", "Rohan Das", "2000-09-30", 26, "West Bengal", "Kolkata", "M.Tech / M.E.", "working_professional", "Machine Learning", "advanced", "pro", ["Teach or mentor others"], ["Indian languages", "Governance"], "en", 190],
  ["u-sneha", "Sneha Patil", "2007-06-12", 19, "Maharashtra", "Nashik", "Diploma / ITI", "college_student", "Agri-tech", "beginner", "explorer", ["Explore AI careers"], ["Agriculture", "Rural India"], "hi", 100],
  ["u-mohit", "Mohit Yadav", "2006-12-01", 19, "Rajasthan", "Jaipur", "BBA / BCA", "college_student", "Computer Applications", "beginner", "explorer", ["Get job-ready"], ["Climate", "Software development"], "en", 60],
  ["u-lakshmi", "Lakshmi Devi", "1990-04-11", 36, "Andhra Pradesh", "Visakhapatnam", "M.Sc / M.A. / M.Com", "educator", "Mathematics", "beginner", "explorer", ["Teach or mentor others"], ["Education", "Indian languages"], "en", 320],
  ["u-tenzin", "Tenzin Dorjee", "2003-08-08", 23, "Sikkim", "Gangtok", "B.A.", "graduate_job_seeker", "Journalism", "beginner", "explorer", ["Get job-ready"], ["Governance", "Creative work"], "en", 240],
  ["u-fatima", "Fatima Khan", "2004-10-19", 22, "Delhi", "New Delhi", "B.Tech / B.E.", "college_student", "Information Technology", "intermediate", "builder", ["Build my first AI project"], ["Accessibility", "Education"], "en", 300],
  ["u-gurpreet", "Gurpreet Kaur", "2002-01-25", 24, "Punjab", "Ludhiana", "B.Sc", "entrepreneur", "Agri-business", "intermediate", "builder", ["Start something of my own"], ["Agriculture", "MSMEs"], "en", 130],
  ["u-biswajit", "Biswajit Nayak", "1994-03-03", 32, "Odisha", "Bhubaneswar", "M.Tech / M.E.", "working_professional", "Civil Engineering", "intermediate", "builder", ["Automate my work"], ["Climate", "Governance"], "en", 170],
];

export const USERS: User[] = seeds.map(([id, name, dob, age, state, city, education, occ, field, exp, level, goals, interests, lang, hue], i) => ({
  id, name, dateOfBirth: dob, age, state, city, education, occupationStatus: occ, field, aiExperience: exp, goals, interests, preferredLanguage: lang,
  accessibilityPreferences: { largeText: false, highContrast: false, reduceMotion: false, screenReader: false },
  ageEligibility: age >= 15 && age <= 29 ? "youth_eligible" : "general", currentLevel: level,
  maskedAadhaar: `XXXX XXXX ${String(4100 + i * 137).slice(-4)}`, avatarHue: hue, createdAt: NOW, updatedAt: NOW,
}));

export const DEMO_USER_ID = "u-aarav";
export const userById = (id: string) => USERS.find((u) => u.id === id);
