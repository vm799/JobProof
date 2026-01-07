import { redirect } from "next/navigation"

// Redeem functionality removed from public routes
export default function RedeemPage() {
  redirect("/dashboard")
}
