import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getOrCreateStripeCustomer } from "@/lib/stripe/customer"
import { stripe } from "@/lib/stripe/client"

export async function POST(req: Request) {
  const { priceId, billingCycle = "monthly" } = await req.json()

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

  const { data: profile } = await supabase.from("profiles").select("current_workspace_id").eq("id", user.id).single()

  if (!profile?.current_workspace_id) {
    return Response.json({ error: "No workspace found" }, { status: 400 })
  }

  const customerId = await getOrCreateStripeCustomer(profile.current_workspace_id)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    metadata: {
      workspace_id: profile.current_workspace_id,
      billing_cycle: billingCycle,
    },
  })

  return Response.json({ sessionId: session.id, url: session.url })
}
