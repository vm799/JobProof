import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) {
    return Response.json({ error: "No workspace found" }, { status: 404 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const search = searchParams.get("search") || ""

  const offset = (page - 1) * limit

  let query = supabase
    .from("onboarding_flows")
    .select(
      `
      id,
      name,
      description,
      status,
      created_at,
      onboarding_steps(id),
      client_onboardings(id, status)
    `,
      { count: "exact" },
    )
    .eq("workspace_id", profile.current_workspace_id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  const { data: flows, count, error } = await query

  if (error) {
    console.error("[v0] Flows fetch error:", error)
    return Response.json({ error: "Failed to fetch flows" }, { status: 500 })
  }

  return Response.json({
    flows: flows || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}
