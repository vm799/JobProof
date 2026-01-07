import { ProofReport } from "@/components/proof-report"

export const dynamic = "force-dynamic"

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-5xl mx-auto">
      <ProofReport jobId={params.id} />
    </div>
  )
}
