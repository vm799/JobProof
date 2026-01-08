import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { stripe } from "@/lib/stripe/client"

export async function GET(req: Request) {
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

  const { data: billing } = await supabase
    .from("billing_accounts")
    .select("stripe_customer_id")
    .eq("workspace_id", profile.current_workspace_id)
    .single()

  if (!billing?.stripe_customer_id) {
    return Response.json({ paymentMethods: [] })
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: billing.stripe_customer_id,
    type: "card",
  })

  return Response.json({
    paymentMethods: paymentMethods.data.map((pm) => ({
      id: pm.id,
      last4: pm.card?.last4,
      brand: pm.card?.brand,
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
    })),
  })
}

export async function DELETE(req: Request) {
  const { paymentMethodId } = await req.json()

  await stripe.paymentMethods.detach(paymentMethodId)

  return Response.json({ success: true })
}
