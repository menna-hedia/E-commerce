import { Suspense } from "react"
import Link from "next/link"
import { getAllCategories, getProducts } from "_/api/services/routeServices"
import { HeroSlider } from "./_components/HeroSlider/HeroSlider"
import { ShopByCategory } from "./_components/ShopByCategory/ShopByCategory"
import ProductGrid from "./_components/ProductGrid/ProductGrid"
import ProductGridSkeleton from "./_components/ProductGridSkeleton/ProductGridSkeleton"
import { getUserWishlist } from "./wishlist/wishlist.actions"

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="font-heading text-2xl font-bold md:text-3xl">{title}</h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

async function Categories() {
  const categories = await getAllCategories()
  return <ShopByCategory categories={categories} loading={false} />
}

async function FeaturedProducts() {
  const [{ data }, wishlist] = await Promise.all([
    getProducts({ limit: 12 }),
    getUserWishlist(),
  ])
  const wishlistIds: string[] = wishlist ? wishlist.map((item: any) => item._id) : []

  return (
    <>
      <ProductGrid products={data} wishlistIds={wishlistIds} />
      <div className="mt-10 flex justify-center">
        <Link
          href="/products"
          className="inline-flex h-12 items-center rounded-full border border-brand px-8 text-sm font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-brand-foreground active:scale-95"
        >
          Browse all products
        </Link>
      </div>
    </>
  )
}

export default function HomePage() {
  // The hero paints immediately. Categories and products stream in as they load.
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 sm:pt-6">
      <HeroSlider />

      <section className="mt-16">
        <SectionHeading title="Shop by category" href="/categories" linkLabel="View all" />
        <div className="mt-8">
          <Suspense fallback={<ShopByCategory loading />}>
            <Categories />
          </Suspense>
        </div>
      </section>

      <section id="products" className="mt-20 scroll-mt-24">
        <SectionHeading title="Featured products" href="/products" linkLabel="View all" />
        <div className="mt-8">
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
    </div>
  )
}