import type { Metadata } from "next"
import Link from "next/link"
import { ChevronDown, Package } from "lucide-react"
import { getUserOrders } from "_/api/services/routeServices"
import { OrderType } from "_/api/types"
import PageHeader from "../_components/PageHeader/PageHeader"
import EmptyState from "../_components/EmptyState/EmptyState"
import { cn } from "_/lib/utils"

export const metadata: Metadata = { title: "My orders" }

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
}

function Pill({ tone, children }: { tone: "good" | "warn" | "neutral"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        tone === "good" && "bg-brand/10 text-brand",
        tone === "warn" && "bg-marigold/20 text-foreground",
        tone === "neutral" && "bg-secondary text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

function OrderCard({ order, index }: { order: OrderType; index: number }) {
  const items = order.cartItems ?? []
  const itemCount = items.reduce((n, item) => n + item.count, 0)
  const preview = items.slice(0, 4)
  const extra = items.length - preview.length
  const address = order.shippingAddress

  const paymentLabel = order.isPaid
    ? "Paid"
    : order.paymentMethodType === "cash"
      ? "Pay on delivery"
      : "Awaiting payment"

  return (
    <li
      className="fade-up rounded-2xl bg-card ring-1 ring-border"
      style={{ "--d": `${Math.min(index, 6) * 60}ms` } as React.CSSProperties}
    >
      <details className="group">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
          <div className="flex -space-x-3">
            {preview.map((item) => (
              <span
                key={item._id}
                className="size-12 overflow-hidden rounded-xl bg-muted ring-2 ring-card"
              >
                {item.product?.imageCover && (
                  <img
                    src={item.product.imageCover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                )}
              </span>
            ))}
            {extra > 0 && (
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-sm font-semibold ring-2 ring-card">
                +{extra}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold">Order #{order.id ?? order._id.slice(-6)}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={order.isDelivered ? "good" : "warn"}>
              {order.isDelivered ? "Delivered" : "Processing"}
            </Pill>
            <Pill tone={order.isPaid ? "good" : "neutral"}>{paymentLabel}</Pill>
          </div>

          <p className="font-heading text-lg font-bold">
            {order.totalOrderPrice.toLocaleString("en-US")} EGP
          </p>
          <ChevronDown className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
        </summary>

        <div className="grid gap-6 border-t p-5 md:grid-cols-[1fr_260px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item._id} className="flex items-center gap-4">
                <span className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {item.product?.imageCover && (
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  {item.product ? (
                    <Link
                      href={`/products/${item.product._id}`}
                      className="line-clamp-2 text-sm font-medium transition-colors hover:text-brand"
                    >
                      {item.product.title}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium">Product no longer available</p>
                  )}
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.count} × {item.price.toLocaleString("en-US")} EGP
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {(item.count * item.price).toLocaleString("en-US")} EGP
                </p>
              </li>
            ))}
          </ul>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold">Delivery address</p>
              <p className="mt-1 text-muted-foreground">
                {[address?.details, address?.city].filter(Boolean).join(", ") || "Not provided"}
              </p>
              {address?.phone && <p className="text-muted-foreground">{address.phone}</p>}
            </div>
            <div>
              <p className="font-semibold">Payment</p>
              <p className="mt-1 text-muted-foreground">
                {order.paymentMethodType === "cash" ? "Cash on delivery" : "Card, paid online"}
              </p>
            </div>
          </div>
        </div>
      </details>
    </li>
  )
}

export default async function OrdersPage() {
  const orders = await getUserOrders()

  if (!orders.length) {
    return (
      <EmptyState
        icon={<Package />}
        title="No orders yet"
        text="When you place an order, you can track it here."
        href="/products"
        cta="Start shopping"
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        title="My orders"
        description={`${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
      />
      <ul className="mt-8 space-y-4">
        {orders.map((order, i) => (
          <OrderCard key={order._id} order={order} index={i} />
        ))}
      </ul>
    </div>
  )
}