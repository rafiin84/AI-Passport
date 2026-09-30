import { EvidencePage } from "@/features/verification/evidence-page";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <EvidencePage id={id} />; }
