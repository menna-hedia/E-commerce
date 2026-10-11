import { Suspense } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { SearchX } from "lucide-react"
import {
  getProduct,
  getProductReviews,
  getProducts,
} from "_/api/services/routeServices"
import AddToCartButton from "./../../_components/AddToCartButton/AddToCartButton"
import WishlistButton from "_/app/_components/WishListButton/WishListButton"
import ProductGallery from "_/app/_components/ProductGallery/ProductGallery"
import EmptyState from "_/app/_components/EmptyState/EmptyState"
import ProductGrid from "_/app/_components/ProductGrid/ProductGrid"
import ProductGridSkeleton from "_/app/_components/ProductGridSkeleton/ProductGridSkeleton"
import ReviewsSection from "_/app/_components/ReviewsSection/ReviewsSection"
import StarRating from "_/app/_components/StarRating/StarRating"
import { getUserWishlist } from "_/app/wishlist/wishlist.actions"
import { getSessionUserId } from "_/app/utils"

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  return {
    title: product?.title ?? "Product",
    description: product?.description?.slice(0, 160),
  }
}

async function RelatedProducts({
  categoryId,
  productId,
  wishlistIds,
}: {
  categoryId: string
  productId: string
  wishlistIds: string[]
}) {
  const { data } = await getProducts({ category: categoryId, limit: 5 })
  const related = data.filter((p) => p._id !== productId).slice(0, 4)
  if (!related.length) return null

  return (
    <section className="mt-20">
      <h2 className="font-heading text-2xl font-bold md:text-3xl">You may also like</h2>
      <div className="mt-8">
        <ProductGrid products={related} wishlistIds={wishlistIds} />
      </div>
    </section>
  )
}

export default async function ProductDetails({ params }: { params: Params }) {
  const { id } = await params

  const [product, wishlist, reviews, userId] = await Promise.all([
    getProduct(id),
    getUserWishlist(),
    getProductReviews(id),
    getSessionUserId(),
  ])

  if (!product) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="Product not found"
        text="This product may have been removed."
        href="/products"
        cta="Browse products"
      />
    )
  }

  const wishlistIds: string[] = wishlist ? wishlist.map((item: any) => item._id) : []
  const isInWishlist = wishlistIds.includes(product._id)

  const gallery = Array.from(
    new Set([product.imageCover, ...(product.images ?? [])].filter(Boolean))
  )

  const hasDiscount =
    typeof product.priceAfterDiscount === "number" && product.priceAfterDiscount < product.price
  const finalPrice = hasDiscount ? (product.priceAfterDiscount as number) : product.price
  const soldOut = product.quantity === 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-14">
      <div className="grid gap-8 md:grid-cols-2 md:gap-14">
        <ProductGallery images={gallery} title={product.title} />

        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-heading text-3xl font-bold leading-tight md:text-4xl">
              {product.title}
            </h1>
            <WishlistButton productId={product._id} isInWishlistInitial={isInWishlist} />
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              href={`/categories/${product.category._id}`}
              className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              {product.category.name}
            </Link>
            <Link
              href={`/brands/${product.brand._id}`}
              className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              {product.brand.name}
            </Link>
          </div>

          <a href="#reviews" className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
            <StarRating value={product.ratingsAverage} size={20} />
            <span className="font-medium">
              {product.ratingsAverage} · {reviews.length || product.ratingsQuantity} reviews
            </span>
          </a>

          <div className="space-y-3 border-y py-5">
            <p className="flex flex-wrap items-baseline gap-x-3 font-heading text-4xl font-bold">
              <span>
                {finalPrice.toLocaleString("en-US")}{" "}
                <span className="text-base font-medium text-muted-foreground">EGP</span>
              </span>
              {hasDiscount && (
                <span className="text-lg font-medium text-muted-foreground line-through">
                  {product.price.toLocaleString("en-US")}
                </span>
              )}
            </p>
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className={`size-2 rounded-full ${soldOut ? "bg-destructive" : "bg-brand"}`} />
                {soldOut ? "Out of stock" : `${product.quantity} in stock`}
              </span>
              <span>{product.sold} sold</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold">Description</h2>
            <p className="max-w-prose leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          <div className="mt-auto">
            <AddToCartButton id={product._id} disabled={soldOut} />
          </div>
        </div>
      </div>

      <div className="mt-20">
        <ReviewsSection
          productId={product._id}
          reviews={reviews}
          userId={userId}
          average={product.ratingsAverage}
        />
      </div>

      <Suspense fallback={<div className="mt-20"><ProductGridSkeleton count={4} /></div>}>
        <RelatedProducts
          categoryId={product.category._id}
          productId={product._id}
          wishlistIds={wishlistIds}
        />
      </Suspense>
    </div>
  )
}