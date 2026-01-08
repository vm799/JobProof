"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Camera } from "lucide-react"

interface JobCardProps {
  job: any
  onCapturePhoto: () => void
}

export function JobCard({ job, onCapturePhoto }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{job.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{job.site?.name}</span>
            </div>
          </div>
          <Badge variant={job.status === "completed" ? "default" : "secondary"}>{job.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {job.site?.address && <p className="text-sm text-gray-600">{job.site.address}</p>}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Assigned: {new Date(job.created_at).toLocaleDateString()}</span>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Proof Photos: {job.proofs?.length || 0}</p>
          {job.proofs && job.proofs.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {job.proofs.slice(0, 3).map((proof: any) => (
                <div key={proof.id} className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  {proof.file_type === "image" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/proof/${proof.id}`} alt="Proof" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {job.status === "assigned" && (
          <Button onClick={onCapturePhoto} className="w-full" size="lg">
            <Camera className="w-4 h-4 mr-2" />
            Capture Photo
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
