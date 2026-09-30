import { VerificationResult } from "@/features/verification/verification-result";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <VerificationResult id={id} />; }
