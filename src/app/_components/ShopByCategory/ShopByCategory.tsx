"use client"

import { CategoryType } from "_/api/types"
import { Skeleton } from "_/components/ui/skeleton"
import Link from "next/link"
import Reveal from "../Reveal/Reveal"

type Props = {
  categories?: CategoryType[]
  loading?: boolean
}

export function ShopByCategory({ categories, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-full" />
            <Skeleton className="mx-auto h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (!categories?.length) {
    return <p className="py-10 text-center text-muted-foreground">No categories found</p>
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((cat, i) => (
        <Reveal key={cat._id} delay={Math.min(i, 7) * 60}>
          <Link
            href={`/categories/${cat._id}`}
            className="group flex flex-col items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-card"
          >
            <span className="relative aspect-square w-full overflow-hidden rounded-full ring-1 ring-border transition-all duration-500 group-hover:ring-4 group-hover:ring-brand/30">
              <img
                src={cat.image}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </span>
            <span className="text-center text-sm font-semibold transition-colors group-hover:text-brand">
              {cat.name}
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}