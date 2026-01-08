import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File
  const jobId = formData.get("jobId") as string
  const workspaceId = formData.get("workspaceId") as string

  if (!file || !jobId || !workspaceId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Generate unique file path
  const timestamp = Date.now()
  const filePath = `proofs/${workspaceId}/${jobId}/${timestamp}-${file.name}`

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage.from("proofs").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 })
  }

  // Create proof record in database
  const { data: proof, error: dbError } = await supabase
    .from("proofs")
    .insert({
      job_id: jobId,
      workspace_id: workspaceId,
      uploaded_by: user.id,
      file_path: filePath,
      file_type: file.type.startsWith("video") ? "video" : "image",
      file_size: file.size,
      metadata: {
        original_name: file.name,
        mime_type: file.type,
      },
    })
    .select()
    .single()

  if (dbError) {
    return Response.json({ error: dbError.message }, { status: 500 })
  }

  // Get signed URL
  const { data: signedUrl } = await supabase.storage.from("proofs").createSignedUrl(filePath, 3600)

  return Response.json({
    proof: {
      ...proof,
      url: signedUrl?.signedUrl,
    },
  })
}
