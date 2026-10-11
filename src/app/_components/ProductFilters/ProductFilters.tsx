"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react"
import { BrandType, CategoryType } from "_/api/types"
import { cn } from "_/lib/utils"

const sortOptions = [
  { value: "", label: "Featured" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
  { value: "-ratingsAverage", label: "Top rated" },
  { value: "-sold", label: "Best selling" },
  { value: "-createdAt", label: "Newest" },
]

type Chip = { id: string; label: string; clear: Record<string, string> }

const selectClass =
  "h-12 w-full appearance-none rounded-xl border border-input bg-card pl-4 pr-10 text-sm outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand focus:ring-4 focus:ring-brand/15"

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand focus:ring-4 focus:ring-brand/15"

function SelectBox({ children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={selectClass}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export default function ProductFilters({
  categories,
  brands,
}: {
  categories: CategoryType[]
  brands: BrandType[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const urlKeyword = searchParams.get("keyword") ?? ""
  const sort = searchParams.get("sort") ?? ""
  const category = searchParams.get("category") ?? ""
  const brand = searchParams.get("brand") ?? ""
  const urlMin = searchParams.get("min") ?? ""
  const urlMax = searchParams.get("max") ?? ""

  const [keyword, setKeyword] = useState(urlKeyword)
  const [min, setMin] = useState(urlMin)
  const [max, setMax] = useState(urlMax)
  const [open, setOpen] = useState(Boolean(category || brand || urlMin || urlMax))

  const update = useCallback(
    (changes: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(changes).forEach(([key, value]) =>
        value ? params.set(key, value) : params.delete(key)
      )
      params.delete("page")
      const qs = params.toString()
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
      })
    },
    [searchParams, pathname, router]
  )

  // Search as you type, after a short pause.
  useEffect(() => {
    const trimmed = keyword.trim()
    if (trimmed === urlKeyword) return
    const timer = setTimeout(() => update({ keyword: trimmed }), 400)
    return () => clearTimeout(timer)
  }, [keyword, urlKeyword, update])

  const chips: Chip[] = []
  if (urlKeyword) chips.push({ id: "keyword", label: `"${urlKeyword}"`, clear: { keyword: "" } })
  if (category)
    chips.push({
      id: "category",
      label: categories.find((c) => c._id === category)?.name ?? "Category",
      clear: { category: "" },
    })
  if (brand)
    chips.push({
      id: "brand",
      label: brands.find((b) => b._id === brand)?.name ?? "Brand",
      clear: { brand: "" },
    })
  if (urlMin || urlMax)
    chips.push({
      id: "price",
      label: `${urlMin || "0"} - ${urlMax || "any"} EGP`,
      clear: { min: "", max: "" },
    })

  const advancedCount = chips.filter((c) => c.id !== "keyword").length

  function removeChip(chip: Chip) {
    if (chip.id === "keyword") setKeyword("")
    if (chip.id === "price") {
      setMin("")
      setMax("")
    }
    update(chip.clear)
  }

  function clearAll() {
    setKeyword("")
    setMin("")
    setMax("")
    update({ keyword: "", category: "", brand: "", min: "", max: "", sort: "" })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand focus:ring-4 focus:ring-brand/15"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-56 sm:flex-none">
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              aria-label="Sort products"
              className="h-12 w-full appearance-none rounded-full border border-input bg-card pl-5 pr-10 text-sm outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand focus:ring-4 focus:ring-brand/15"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all duration-200 active:scale-95",
              open ? "border-brand bg-brand/10 text-brand" : "border-input bg-card hover:bg-secondary"
            )}
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {advancedCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-brand text-xs text-brand-foreground">
                {advancedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="grid gap-4 rounded-2xl bg-card p-4 ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1.5 text-sm font-medium">
              Category
              <SelectBox value={category} onChange={(e) => update({ category: e.target.value })}>
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </SelectBox>
            </label>

            <label className="space-y-1.5 text-sm font-medium">
              Brand
              <SelectBox value={brand} onChange={(e) => update({ brand: e.target.value })}>
                <option value="">All brands</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </SelectBox>
            </label>

            <form
              className="grid grid-cols-[1fr_1fr_auto] items-end gap-2 sm:col-span-2"
              onSubmit={(e) => {
                e.preventDefault()
                update({ min: min.trim(), max: max.trim() })
              }}
            >
              <label className="space-y-1.5 text-sm font-medium">
                Min price
                <input
                  inputMode="numeric"
                  value={min}
                  onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
                  placeholder="0"
                  className={inputClass}
                />
              </label>
              <label className="space-y-1.5 text-sm font-medium">
                Max price
                <input
                  inputMode="numeric"
                  value={max}
                  onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
                  placeholder="Any"
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                className="h-12 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-all duration-200 hover:bg-brand/90 active:scale-95"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => removeChip(chip)}
              className="group inline-flex items-center gap-1.5 rounded-full bg-secondary py-1.5 pl-3.5 pr-2.5 text-sm transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Remove filter ${chip.label}`}
            >
              {chip.label}
              <X className="size-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="px-2 text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div
        aria-hidden
        className={cn(
          "h-0.5 overflow-hidden rounded-full bg-secondary transition-opacity duration-200",
          isPending ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="h-full w-full animate-pulse bg-brand" />
      </div>
    </div>
  )
}