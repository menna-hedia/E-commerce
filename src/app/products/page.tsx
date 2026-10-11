import { Suspense } from "react"
import type { Metadata } from "next"
import { SearchX } from "lucide-react"
import { ProductQuery } from "_/api/types"
import { getAllBrands, getAllCategories, getProducts } from "_/api/services/routeServices"
import PageHeader from "../_components/PageHeader/PageHeader"
import EmptyState from "../_components/EmptyState/EmptyState"
import ProductFilters from "../_components/ProductFilters/ProductFilters"
import ProductGrid from "../_components/ProductGrid/ProductGrid"
import ProductGridSkeleton from "../_components/ProductGridSkeleton/ProductGridSkeleton"
import Pagination from "../_components/Pagination/Pagination"
import { getUserWishlist } from "../wishlist/wishlist.actions"

export const metadata: Metadata = { title: "Products" }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

async function ProductResults({
  query,
  params,
}: {
  query: ProductQuery
  params: Record<string, string | undefined>
}) {
  const [{ data, metadata }, wishlist] = await Promise.all([
    getProducts(query),
    getUserWishlist(),
  ])
  const wishlistIds: string[] = wishlist ? wishlist.map((item: any) => item._id) : []

  if (!data.length) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="No products found"
        text="Try a different search or clear your filters."
        href="/products"
        cta="Clear filters"
      />
    )
  }

  const currentPage = metadata?.currentPage ?? 1
  const totalPages = metadata?.numberOfPages ?? 1

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <ProductGrid products={data} wishlistIds={wishlistIds} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/products"
        params={params}
      />
    </>
  )
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams

  const params = {
    keyword: first(sp.keyword),
    sort: first(sp.sort),
    category: first(sp.category),
    brand: first(sp.brand),
    min: first(sp.min),
    max: first(sp.max),
    page: first(sp.page),
  }

  const query: ProductQuery = {
    page: Number(params.page) || 1,
    limit: 12,
    keyword: params.keyword,
    sort: params.sort,
    category: params.category,
    brand: params.brand,
    minPrice: Number(params.min) || undefined,
    maxPrice: Number(params.max) || undefined,
  }

  const [categories, brands] = await Promise.all([getAllCategories(), getAllBrands()])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <PageHeader title="All products" description="Search, filter and sort to find what you need." />

      <div className="mt-8">
        <ProductFilters categories={categories ?? []} brands={brands ?? []} />
      </div>

      <div className="mt-8">
        <Suspense key={JSON.stringify(params)} fallback={<ProductGridSkeleton count={8} />}>
          <ProductResults query={query} params={params} />
        </Suspense>
      </div>
    </div>
  )
}