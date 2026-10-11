"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "_/lib/utils"

type Props = {
  className?: string
  inputClassName?: string
  onSubmitted?: () => void
}

export default function SearchBox({ className, inputClassName, onSubmitted }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function submit(e: FormEvent) {
    e.preventDefault()
    const keyword = query.trim()
    router.push(keyword ? `/products?keyword=${encodeURIComponent(keyword)}` : "/products")
    onSubmitted?.()
  }

  return (
    <form role="search" onSubmit={submit} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className={cn(
          "h-10 w-full rounded-full border border-transparent bg-secondary pl-10 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/15",
          inputClassName
        )}
      />
    </form>
  )
}