"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { ApiError } from "@/lib/api/db";
import { toast } from "@/store/toast";

export const qk = {
  profile: ["profile"] as const,
  result: ["baseline-result"] as const,
  path: ["path"] as const,
  courses: (q: unknown) => ["courses", q] as const,
  course: (id: string) => ["course", id] as const,
  enrollments: ["enrollments"] as const,
  recs: ["recs"] as const,
  credentials: ["credentials"] as const,
  passport: ["passport"] as const,
  projects: (s: string) => ["projects", s] as const,
  notifications: ["notifications"] as const,
};

export const useProfile = () => useQuery({ queryKey: qk.profile, queryFn: api.getProfile, staleTime: 30_000 });
export const useBaselineResult = () => useQuery({ queryKey: qk.result, queryFn: api.getBaselineResult, retry: false });
export const useLearningPath = () => useQuery({ queryKey: qk.path, queryFn: api.getLearningPath, retry: false });
export const useCourses = (q: api.CourseQuery) => useQuery({ queryKey: qk.courses(q), queryFn: () => api.listCourses(q), placeholderData: (p) => p });
export const useCourse = (id: string) => useQuery({ queryKey: qk.course(id), queryFn: () => api.getCourse(id), retry: false });
export const useEnrollments = () => useQuery({ queryKey: qk.enrollments, queryFn: api.getEnrollments, retry: false });
export const useRecommendations = (n = 4) => useQuery({ queryKey: [...qk.recs, n], queryFn: () => api.getRecommendations(n), retry: false });
export const useCredentials = () => useQuery({ queryKey: qk.credentials, queryFn: api.listCredentials, retry: false });
export const usePassport = () => useQuery({ queryKey: qk.passport, queryFn: () => api.getPassport(), retry: false });
export const useProjects = (scope: "mine" | "public" = "mine") => useQuery({ queryKey: qk.projects(scope), queryFn: () => api.listProjects(scope), retry: false });
export const useNotifications = () => useQuery({ queryKey: qk.notifications, queryFn: api.listNotifications, retry: false });

/** Wraps a mutation: invalidates everything (mock DB is global) and surfaces errors as toasts. */
export function useAction<TIn, TOut>(fn: (v: TIn) => Promise<TOut>, opts?: { success?: string; onSuccess?: (o: TOut) => void; silentError?: boolean }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async (out) => {
      await qc.invalidateQueries();
      if (opts?.success) toast.success(opts.success);
      opts?.onSuccess?.(out);
    },
    onError: (e) => { if (!opts?.silentError) toast.error("That didn't work", e instanceof ApiError ? e.message : "Something went wrong. Please try again."); },
  });
}

export const errorMessage = (e: unknown) => (e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
export const isAuthError = (e: unknown) => e instanceof ApiError && e.status === 401;
