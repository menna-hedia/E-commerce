import { Star } from "lucide-react"
import { ProductType } from "_/api/types"
import Link from "next/link"
import AddToCartButton from "./../AddToCartButton/AddToCartButton"
import WishlistButton from "../WishListButton/WishListButton"

type Props = {
  product: ProductType
  isInWishlist: boolean
}

export function ProductCard({ product, isInWishlist }: Props) {
  const hasDiscount =
    typeof product.priceAfterDiscount === "number" && product.priceAfterDiscount < product.price
  const finalPrice = hasDiscount ? (product.priceAfterDiscount as number) : product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - finalPrice) / product.price) * 100)
    : 0
  const soldOut = product.quantity === 0

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] hover:ring-brand/30">
      <div className="absolute right-3 top-3 z-10">
        <WishlistButton
          productId={product._id}
          isInWishlistInitial={isInWishlist}
        />
      </div>

      <Link
        href={`/products/${product._id}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.imageCover}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {product.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
            {product.category.name}
          </span>
        )}

        {hasDiscount && (
          <span className="absolute bottom-3 left-3 rounded-full bg-marigold px-2.5 py-1 text-xs font-bold text-deep">
            -{discountPercent}%
          </span>
        )}

        {soldOut && (
          <span className="absolute inset-0 grid place-items-center bg-background/70 text-sm font-semibold backdrop-blur-[2px]">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/products/${product._id}`}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug transition-colors group-hover:text-brand"
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star className="size-4 fill-marigold text-marigold" />
          <span className="font-medium text-foreground">{product.ratingsAverage}</span>
          <span>({product.ratingsQuantity})</span>
        </div>

        <p className="mt-auto flex flex-wrap items-baseline gap-x-2 font-heading text-xl font-bold">
          <span>
            {finalPrice.toLocaleString("en-US")}{" "}
            <span className="text-xs font-medium text-muted-foreground">EGP</span>
          </span>
          {hasDiscount && (
            <span className="text-sm font-medium text-muted-foreground line-through">
              {product.price.toLocaleString("en-US")}
            </span>
          )}
        </p>

        <AddToCartButton id={product._id} disabled={soldOut} />
      </div>
    </article>
  )
}