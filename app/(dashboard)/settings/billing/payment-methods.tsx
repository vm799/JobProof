"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PaymentMethod {
  id: string
  last4: string
  brand: string
  expMonth: number
  expYear: number
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  async function fetchPaymentMethods() {
    try {
      const res = await fetch("/api/stripe/payment-methods")
      const data = await res.json()
      setPaymentMethods(data.paymentMethods)
    } catch (error) {
      console.error("Error fetching payment methods:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deletePaymentMethod(paymentMethodId: string) {
    if (!confirm("Are you sure you want to delete this payment method?")) return

    try {
      await fetch("/api/stripe/payment-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId }),
      })

      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== paymentMethodId))
    } catch (error) {
      console.error("Error deleting payment method:", error)
    }
  }

  if (loading) return <div>Loading payment methods...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length === 0 ? (
          <p className="text-gray-600">No payment methods on file</p>
        ) : (
          paymentMethods.map((pm) => (
            <div key={pm.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold capitalize">{pm.brand}</p>
                <p className="text-sm text-gray-600">•••• {pm.last4}</p>
                <p className="text-sm text-gray-600">
                  Expires {pm.expMonth}/{pm.expYear}
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deletePaymentMethod(pm.id)}>
                Delete
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
