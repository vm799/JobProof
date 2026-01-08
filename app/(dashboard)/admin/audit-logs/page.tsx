import { createClient } from "@/lib/supabase/server"
import { requireRole } from "@/lib/rbac"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AuditLogsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return <div>Not authenticated</div>

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) return <div>No workspace</div>

  await requireRole(["admin"], profile.current_workspace_id)

  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })
    .limit(100)

  const { data: proofEvents } = await supabase
    .from("proof_events")
    .select("*")
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })
    .limit(100)

  const { data: roleAudit } = await supabase
    .from("role_audit_logs")
    .select("*")
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-gray-600">Immutable record of all actions, role changes, and proof verifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proof Verification Events</CardTitle>
          <CardDescription>Complete history of all proof submissions, verifications, and rejections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proofEvents && proofEvents.length > 0 ? (
              proofEvents.map((event: any) => (
                <div key={event.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold capitalize">{event.event_type}</span>
                      <p className="text-sm text-gray-600">
                        {event.previous_state} → {event.new_state}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(event.created_at), "MMM dd, yyyy HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm mt-2">
                    By: {event.actor_role} • Role: {event.actor_role}
                  </p>
                  {event.metadata && (
                    <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto max-h-24">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No proof events yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Changes</CardTitle>
          <CardDescription>Track user role changes within the workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roleAudit && roleAudit.length > 0 ? (
              roleAudit.map((log: any) => (
                <div key={log.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold">
                        {log.old_role} → {log.new_role}
                      </span>
                      {log.reason && <p className="text-sm text-gray-600">Reason: {log.reason}</p>}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(log.created_at), "MMM dd, yyyy HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm mt-2">Changed by: {log.changed_by}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No role changes yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
          <CardDescription>General audit log of user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.map((log: any) => (
                <div key={log.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold capitalize">{log.action}</span>
                      <p className="text-sm text-gray-600">Entity: {log.entity_type}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(log.created_at), "MMM dd, yyyy HH:mm")}
                    </span>
                  </div>
                  {log.ip_address && <p className="text-xs text-gray-500 mt-2">IP: {log.ip_address}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No actions yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
