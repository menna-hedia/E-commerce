import { redirect } from "next/navigation"

// Stripe sends people here after an online payment.
export default function AllOrdersPage() {
  redirect("/orders")
}