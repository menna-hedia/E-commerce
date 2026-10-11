import type { Metadata } from "next"
import { ShoppingBag } from "lucide-react"
import { getUserAddresses, getUserCart } from "_/api/services/routeServices"
import EmptyState from "../../_components/EmptyState/EmptyState"
import CheckoutForm from "./CheckoutForm"

export const metadata: Metadata = { title: "Checkout" }

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [cart, addresses] = await Promise.all([getUserCart(), getUserAddresses()])

  if (!cart || !cart.products?.length) {
    return (
      <EmptyState
        icon={<ShoppingBag />}
        title="Your cart is empty"
        text="Add a few products before you check out."
        href="/products"
        cta="Browse products"
      />
    )
  }

  // Send the browser only what the summary needs, not full product documents.
  const items = cart.products.map((item) => ({
    id: item._id,
    title: item.product.title,
    image: item.product.imageCover,
    count: item.count,
    price: item.price,
  }))

  return (
    <CheckoutForm
      cartId={id}
      items={items}
      total={cart.totalCartPrice}
      addresses={addresses}
    />
  )
}