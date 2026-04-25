"use client"

import { CategoryType } from "_/api/types"
import { Skeleton } from "_/components/ui/skeleton"
import Link from "next/link"

type Props = {
  categories?: CategoryType[]
  loading?: boolean
}

export function ShopByCategory({ categories, loading }: Props) {
  return (
    <div className="mt-12 ">
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">

          {categories?.length ? (
            categories.map((cat) => (
              <Link href={`/categories/${cat._id}`} key={cat._id}>
              <div  className="cursor-pointer group border rounded-xl p-5">
                <div className="overflow-hidden rounded-full">
                  <img
                    src={cat.image}
                    className="w-full h-35 object-cover group-hover:scale-110 transition"
                  />
                </div>
                <h3 className="text-center mt-2 font-semibold">
                  {cat.name}
                </h3>
              </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No categories found
            </p>
          )}

        </div>
      )}
    </div>
  )
}