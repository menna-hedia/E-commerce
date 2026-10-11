import { Skeleton } from "_/components/ui/skeleton"
import ProductGridSkeleton from "../_components/ProductGridSkeleton/ProductGridSkeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="mt-3 h-5 w-80 max-w-full" />
      <Skeleton className="mt-8 h-12 w-full rounded-full" />
      <div className="mt-8">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  )
}