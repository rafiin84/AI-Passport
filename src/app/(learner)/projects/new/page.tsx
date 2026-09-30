import type { Metadata } from "next";
import { ProjectForm } from "@/features/projects/project-form";
export const metadata: Metadata = { title: "New project" };
export default function Page() { return <ProjectForm />; }
