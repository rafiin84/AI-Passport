import { z } from "zod";
import { ageFromDob } from "@/lib/utils";

export const aadhaarSchema = z.object({
  aadhaar: z.string().transform((v) => v.replace(/\s/g, "")).pipe(z.string().regex(/^\d{12}$/, "Enter all 12 digits of your Aadhaar number")),
});

export const otpSchema = z.object({ otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit OTP") });

export const aboutSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  dateOfBirth: z.string().min(1, "Add your date of birth").refine((v) => { const a = ageFromDob(v); return a >= 10 && a <= 100; }, "Check your date of birth"),
  state: z.string().min(1, "Choose your state or UT"),
  city: z.string().trim().min(2, "Add your city or district"),
});

export const workSchema = z.object({
  education: z.string().min(1, "Choose your education"),
  occupationStatus: z.string().min(1, "Choose what describes you best"),
  field: z.string().trim().min(2, "Add your field of study or work"),
  aiExperience: z.enum(["none", "beginner", "intermediate", "advanced"], { message: "Pick the closest option" }),
});

export const goalsSchema = z.object({
  goals: z.array(z.string()).min(1, "Pick at least one goal"),
  interests: z.array(z.string()).min(1, "Pick at least one interest"),
});

export const prefsSchema = z.object({
  preferredLanguage: z.enum(["en", "hi"]),
  largeText: z.boolean(), highContrast: z.boolean(), reduceMotion: z.boolean(), screenReader: z.boolean(),
});

const optionalUrl = z.string().trim().refine((v) => v === "" || /^https?:\/\/.+\..+/.test(v), "Enter a full link starting with https://");

export const projectSchema = z.object({
  title: z.string().trim().min(4, "Give your project a clear title").max(80),
  problem: z.string().trim().min(30, "Describe the problem in at least a couple of sentences"),
  solution: z.string().trim().min(30, "Describe your solution in at least a couple of sentences"),
  description: z.string().trim().min(20, "Add a short description"),
  aiUsed: z.string().trim().min(5, "Say how AI is used"),
  impact: z.string().trim().min(10, "Share who it helped, or how you'll find out"),
  category: z.string().min(1, "Pick a category"),
  skills: z.array(z.string()).min(1, "Tag at least one skill"),
  liveUrl: optionalUrl, repositoryUrl: optionalUrl, demoUrl: optionalUrl,
});

export const evidenceSchema = z.object({
  type: z.enum(["url", "repository", "demo", "screenshot", "video", "project"]),
  url: z.string().trim().regex(/^https?:\/\/.+\..+/, "Enter a full link starting with https://"),
  note: z.string().trim().min(10, "Add a sentence about what this shows").max(500),
});

export const feedbackSchema = z.object({
  message: z.string().trim().min(10, "Tell us a little more").max(1500),
  email: z.string().trim().refine((v) => v === "" || /^\S+@\S+\.\S+$/.test(v), "Enter a valid email or leave this blank"),
});

export const analyzeSchema = z.object({
  url: z.string().trim().regex(/^https?:\/\/.+\..+/, "Paste a full course URL starting with https://"),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
});
