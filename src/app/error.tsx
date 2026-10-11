"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlert } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="fade-up mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlert className="size-7" />
      </div>
      <h2 className="mt-6 font-heading text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">
        We couldn&apos;t load this page. Try again, and if it keeps happening, come back in a few minutes.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="h-11 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-all hover:bg-brand/90 active:scale-95"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border px-6 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}