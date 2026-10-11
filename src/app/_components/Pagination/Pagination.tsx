import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "_/lib/utils"

type Props = {
  currentPage: number
  totalPages: number
  basePath: string
  params?: Record<string, string | undefined>
}

function pageList(current: number, total: number): (number | "gap")[] {
  const wanted = new Set<number>(
    [1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total)
  )
  const sorted = Array.from(wanted).sort((a, b) => a - b)
  const out: (number | "gap")[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap")
    out.push(p)
  })
  return out
}

export default function Pagination({ currentPage, totalPages, basePath, params = {} }: Props) {
  if (totalPages <= 1) return null

  function href(page: number) {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== "page") qs.set(key, value)
    })
    if (page > 1) qs.set("page", String(page))
    const s = qs.toString()
    return s ? `${basePath}?${s}` : basePath
  }

  const base =
    "grid size-10 place-items-center rounded-full text-sm font-medium transition-all duration-200"

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} aria-label="Previous page" className={cn(base, "hover:bg-secondary")}>
          <ChevronLeft className="size-5" />
        </Link>
      ) : (
        <span className={cn(base, "opacity-30")}>
          <ChevronLeft className="size-5" />
        </span>
      )}

      {pageList(currentPage, totalPages).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={cn(
              base,
              item === currentPage
                ? "bg-brand text-brand-foreground shadow-md shadow-brand/25"
                : "hover:bg-secondary"
            )}
          >
            {item}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} aria-label="Next page" className={cn(base, "hover:bg-secondary")}>
          <ChevronRight className="size-5" />
        </Link>
      ) : (
        <span className={cn(base, "opacity-30")}>
          <ChevronRight className="size-5" />
        </span>
      )}
    </nav>
  )
}