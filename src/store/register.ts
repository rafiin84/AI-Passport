import { create } from "zustand";

export type RegisterStep = "welcome" | "aadhaar" | "consent" | "otp" | "success" | "profile";

interface RegisterState {
  step: RegisterStep;
  masked: string;
  aadhaarDigits: string; // held in memory only for the mock flow; never persisted or rendered in full
  setStep: (s: RegisterStep) => void;
  setAadhaar: (digits: string, masked: string) => void;
  reset: () => void;
}

export const useRegister = create<RegisterState>((set) => ({
  step: "welcome", masked: "", aadhaarDigits: "",
  setStep: (step) => set({ step }),
  setAadhaar: (aadhaarDigits, masked) => set({ aadhaarDigits, masked }),
  reset: () => set({ step: "welcome", masked: "", aadhaarDigits: "" }),
}));
