import Link from "next/link"
import { ArrowLeft, SearchX } from "lucide-react"
import { getBrandDetails, getProducts } from "_/api/services/routeServices"
import EmptyState from "_/app/_components/EmptyState/EmptyState"
import ProductGrid from "_/app/_components/ProductGrid/ProductGrid"
import Pagination from "_/app/_components/Pagination/Pagination"
import { getUserWishlist } from "_/app/wishlist/wishlist.actions"

export default async function BrandDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page } = await searchParams
  const pageNumber = Number(page) || 1

  const [brand, products, wishlist] = await Promise.all([
    getBrandDetails(id),
    getProducts({ brand: id, limit: 12, page: pageNumber }),
    getUserWishlist(),
  ])

  if (!brand) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="Brand not found"
        text="We couldn't find this brand."
        href="/brands"
        cta="All brands"
      />
    )
  }

  const wishlistIds: string[] = wishlist ? wishlist.map((item: any) => item._id) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <Link
        href="/brands"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All brands
      </Link>

      <div className="fade-up mt-6 flex flex-col items-center gap-6 rounded-3xl bg-card p-8 text-center ring-1 ring-border sm:flex-row sm:text-left">
        <img src={brand.image} alt={brand.name} className="h-24 w-40 object-contain sm:h-28" />
        <div>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">{brand.name}</h1>
          <p className="mt-2 text-muted-foreground">Everything we carry from {brand.name}.</p>
        </div>
      </div>

      <h2 className="mt-14 font-heading text-2xl font-bold">Products</h2>

      {products.data.length ? (
        <>
          <div className="mt-8">
            <ProductGrid products={products.data} wishlistIds={wishlistIds} />
          </div>
          <Pagination
            currentPage={products.metadata?.currentPage ?? 1}
            totalPages={products.metadata?.numberOfPages ?? 1}
            basePath={`/brands/${id}`}
          />
        </>
      ) : (
        <p className="py-10 text-muted-foreground">No products from this brand yet.</p>
      )}
    </div>
  )
}