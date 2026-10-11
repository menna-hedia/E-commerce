import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { getUserCart } from "_/api/services/routeServices"
import { CartResponse, ItemType } from "_/api/types"
import { Button } from "_/components/ui/button"
import RemoveButton from "./RemoveButton"
import QuantityButtons from "./counterButtons"
import ClearCartButton from "./ClearCartButton"
import PageHeader from "../_components/PageHeader/PageHeader"
import EmptyState from "../_components/EmptyState/EmptyState"

export default async function CartPage() {
  const cart = (await getUserCart()) as CartResponse | undefined

  if (!cart || !cart.products?.length) {
    return (
      <EmptyState
        icon={<ShoppingBag />}
        title="Your cart is empty"
        text="Add a few products and they will show up here."
        href="/"
        cta="Start shopping"
      />
    )
  }

  const itemsCount = cart.products.reduce((n, item) => n + item.count, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        title="Your cart"
        description={`${itemsCount} ${itemsCount === 1 ? "item" : "items"}`}
        action={<ClearCartButton />}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <ul className="space-y-4">
          {cart.products.map((item: ItemType, i: number) => (
            <li
              key={item._id}
              className="fade-up flex gap-4 rounded-2xl bg-card p-4 ring-1 ring-border sm:gap-6"
              style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
            >
              <Link
                href={`/products/${item.product._id}`}
                className="size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28"
              >
                <img
                  src={item.product.imageCover}
                  alt={item.product.title}
                  className="size-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div>
                  <Link
                    href={`/products/${item.product._id}`}
                    className="line-clamp-2 font-semibold leading-snug transition-colors hover:text-brand"
                  >
                    {item.product.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.price.toLocaleString("en-US")} EGP each
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <QuantityButtons id={item.product._id} count={item.count} />

                  <div className="flex items-center gap-4">
                    <p className="font-heading text-lg font-bold">
                      {(item.price * item.count).toLocaleString("en-US")} EGP
                    </p>
                    <RemoveButton id={item.product._id} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside
          className="fade-up rounded-2xl bg-card p-6 ring-1 ring-border lg:sticky lg:top-24"
          style={{ "--d": "150ms" } as React.CSSProperties}
        >
          <h2 className="font-heading text-xl font-bold">Order summary</h2>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Items</dt>
              <dd>{itemsCount}</dd>
            </div>
            <div className="flex justify-between border-t pt-4 text-base font-semibold">
              <dt>Total</dt>
              <dd className="font-heading text-xl font-bold">
                {cart.totalCartPrice.toLocaleString("en-US")} EGP
              </dd>
            </div>
          </dl>

          <Button asChild className="mt-6 h-12 w-full rounded-xl text-base">
            <Link href={`/cart/${cart._id}`}>Checkout</Link>
          </Button>

          <Link
            href="/"
            className="mt-4 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}