import { Heart } from "lucide-react"
import { ProductCard } from "../_components/ProductCard/ProductCard"
import PageHeader from "../_components/PageHeader/PageHeader"
import EmptyState from "../_components/EmptyState/EmptyState"
import Reveal from "../_components/Reveal/Reveal"
import { getUserWishlist } from "./wishlist.actions"

export default async function WishlistPage() {
  const wishlistItems = await getUserWishlist()

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <EmptyState
        icon={<Heart />}
        title="Your wishlist is empty"
        text="Tap the heart on any product to save it here."
        href="/"
        cta="Browse products"
      />
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        title="Wishlist"
        description={`${wishlistItems.length} saved ${wishlistItems.length === 1 ? "product" : "products"}`}
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((product: any, i: number) => (
          <Reveal key={product._id} delay={(i % 4) * 70} className="h-full">
            <ProductCard product={product} isInWishlist={true} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}