import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get user's workspace
  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) {
    return Response.json({ error: "No workspace found" }, { status: 404 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""

  const offset = (page - 1) * limit

  // Build query with pagination
  let query = supabase
    .from("clients")
    .select(
      `
      id,
      name,
      email,
      created_at,
      client_onboardings(
        id,
        status,
        created_at,
        client_step_progress(id, status)
      )
    `,
      { count: "exact" },
    )
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  // Add search filter
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data: clients, count, error } = await query

  if (error) {
    console.error("[v0] Clients fetch error:", error)
    return Response.json({ error: "Failed to fetch clients" }, { status: 500 })
  }

  // Filter by status on the client side (since it's nested)
  let filteredClients = clients || []
  if (status) {
    filteredClients = filteredClients.filter((client) => {
      const latestOnboarding = client.client_onboardings?.[0]
      return latestOnboarding?.status === status
    })
  }

  return Response.json({
    clients: filteredClients,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}
