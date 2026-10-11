import Link from "next/link"
import { ArrowLeft, SearchX } from "lucide-react"
import {
  getCategoryDetails,
  getProducts,
  getSubCategoriesOnCategory,
} from "_/api/services/routeServices"
import EmptyState from "_/app/_components/EmptyState/EmptyState"
import Reveal from "_/app/_components/Reveal/Reveal"
import ProductGrid from "_/app/_components/ProductGrid/ProductGrid"
import Pagination from "_/app/_components/Pagination/Pagination"
import { getUserWishlist } from "_/app/wishlist/wishlist.actions"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page } = await searchParams
  const pageNumber = Number(page) || 1

  const [category, subCategories, products, wishlist] = await Promise.all([
    getCategoryDetails(id),
    getSubCategoriesOnCategory(id),
    getProducts({ category: id, limit: 12, page: pageNumber }),
    getUserWishlist(),
  ])

  if (!category) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="Category not found"
        text="We couldn't find this category."
        href="/categories"
        cta="All categories"
      />
    )
  }

  const wishlistIds: string[] = wishlist ? wishlist.map((item: any) => item._id) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All categories
      </Link>

      <div className="fade-up mt-6 grid items-center gap-8 overflow-hidden rounded-3xl bg-card p-6 ring-1 ring-border md:grid-cols-[240px_1fr] md:p-8">
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
          <img src={category.image} alt={category.name} className="size-full object-cover" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold md:text-5xl">{category.name}</h1>
          <p className="mt-3 text-muted-foreground">
            {subCategories.length} sub categories
          </p>

          {subCategories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {subCategories.map((sub, i) => (
                <Reveal key={sub._id} delay={Math.min(i, 8) * 40}>
                  <span className="inline-block rounded-full bg-secondary px-4 py-2 text-sm font-medium">
                    {sub.name}
                  </span>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="mt-14 font-heading text-2xl font-bold">Products in {category.name}</h2>

      {products.data.length ? (
        <>
          <div className="mt-8">
            <ProductGrid products={products.data} wishlistIds={wishlistIds} />
          </div>
          <Pagination
            currentPage={products.metadata?.currentPage ?? 1}
            totalPages={products.metadata?.numberOfPages ?? 1}
            basePath={`/categories/${id}`}
          />
        </>
      ) : (
        <p className="py-10 text-muted-foreground">No products in this category yet.</p>
      )}
    </div>
  )
}