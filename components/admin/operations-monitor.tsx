"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, MapPin } from "lucide-react"

export function OperationsMonitor({ liveJobs, recentProofs, teamLocations }: any) {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">Operations Monitor</h1>
        <p className="text-gray-600 mt-2">Real-time view of all active jobs and team locations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Jobs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Jobs ({liveJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveJobs.length === 0 ? (
                <p className="text-gray-600 text-sm">No jobs currently in progress</p>
              ) : (
                liveJobs.map((job: any) => (
                  <div key={job.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{job.name}</p>
                      <p className="text-xs text-gray-600">Assigned to: {job.assigned_to?.full_name}</p>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Team Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teamLocations.length === 0 ? (
                <p className="text-gray-600 text-sm">No field workers active</p>
              ) : (
                teamLocations.slice(0, 5).map((member: any) => (
                  <div key={member.id} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <MapPin className="w-3 h-3 text-gray-600" />
                    <span>{member.full_name}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Proofs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Proof Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentProofs.length === 0 ? (
              <p className="text-gray-600 text-sm">No recent uploads</p>
            ) : (
              recentProofs.map((proof: any) => (
                <div key={proof.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{proof.job?.name}</p>
                    <p className="text-xs text-gray-600">Uploaded by: {proof.uploaded_by?.full_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(proof.created_at).toLocaleString()}</p>
                  </div>
                  {proof.verified_at ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
