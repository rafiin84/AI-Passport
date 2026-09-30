import { CertificatePreview } from "@/components/passport/certificate";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <div className="mx-auto max-w-4xl"><h1 className="sr-only">Certificate</h1><CertificatePreview credentialId={id} /></div>; }
