import { VerifyCredential } from "@/features/passport/verify-credential";
export default async function Page({ params }: { params: Promise<{ credentialId: string }> }) { const { credentialId } = await params; return <VerifyCredential id={credentialId} />; }
