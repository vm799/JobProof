"use client"

import { useState, useEffect } from "react"
import { loadStripe, type Stripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"

export function CheckoutButton({ priceId, planName }: { priceId: string; planName: string }) {
  const [loading, setLoading] = useState(false)
  const [stripe, setStripe] = useState<Stripe | null>(null)

  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      setStripe(stripeInstance)
    }
    initStripe()
  }, [])

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      const { sessionId, url } = await res.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading || !stripe} className="w-full">
      {loading ? "Loading..." : `Upgrade to ${planName}`}
    </Button>
  )
}
