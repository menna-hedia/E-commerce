import { getAllBrands } from "_/api/services/routeServices"
import Link from "next/link"
import PageHeader from "../_components/PageHeader/PageHeader"
import Reveal from "../_components/Reveal/Reveal"

export default async function BrandsPage() {
  const brands = await getAllBrands()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        title="Brands"
        description="Browse by brand and find your favorites."
      />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {brands?.map((brand, i) => (
          <Reveal key={brand._id} delay={Math.min(i, 9) * 50} className="h-full">
            <Link
              href={`/brands/${brand._id}`}
              className="group flex h-full flex-col items-center gap-4 rounded-2xl bg-card p-6 ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 hover:ring-brand/40"
            >
              <div className="flex h-20 w-full items-center justify-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="text-sm font-semibold transition-colors group-hover:text-brand">
                {brand.name}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}