import { createClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/api/api-key-manager"
import { triggerWebhook } from "@/lib/webhooks/webhook-manager"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Validate API key
  const apiKey = request.headers.get("x-api-key")
  if (!apiKey) {
    return Response.json({ error: "Missing API key" }, { status: 401 })
  }

  const auth = await validateApiKey(apiKey)
  if (!auth) {
    return Response.json({ error: "Invalid API key" }, { status: 401 })
  }

  const supabase = await createClient()

  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 100)

  const offset = (page - 1) * limit

  const { data, count, error } = await supabase
    .from("clients")
    .select("id, name, email, created_at", { count: "exact" })
    .eq("workspace_id", auth.workspaceId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })

  if (error) {
    return Response.json({ error: "Failed to fetch clients" }, { status: 500 })
  }

  return Response.json({
    data,
    meta: {
      page,
      limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")
  if (!apiKey) {
    return Response.json({ error: "Missing API key" }, { status: 401 })
  }

  const auth = await validateApiKey(apiKey)
  if (!auth) {
    return Response.json({ error: "Invalid API key" }, { status: 401 })
  }

  const supabase = await createClient()

  try {
    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return Response.json({ error: "Missing required fields: name, email" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("clients")
      .insert({
        workspace_id: auth.workspaceId,
        name,
        email,
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: "Failed to create client" }, { status: 500 })
    }

    // Trigger webhook
    await triggerWebhook(auth.workspaceId, "client.created", data)

    return Response.json({ data }, { status: 201 })
  } catch (err) {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }
}
