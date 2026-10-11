'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus } from "lucide-react"
import { updateCartQuantity, removeFromCart } from "./cart.actions"

export default function QuantityButtons({ id, count }: { id: string; count: number }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function change(next: number) {
    if (busy) return
    setBusy(true)
    try {
      if (next < 1) {
        await removeFromCart(id)
      } else {
        await updateCartQuantity(id, next)
      }
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  const btn =
    "grid size-8 place-items-center rounded-full transition-all duration-200 hover:bg-card hover:shadow-sm active:scale-90 disabled:opacity-50"

  return (
    <div className="inline-flex items-center rounded-full bg-secondary p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={busy}
        onClick={() => change(count - 1)}
        className={btn}
      >
        <Minus className="size-4" />
      </button>

      <span
        key={count}
        className="animate-bump min-w-8 text-center text-sm font-semibold tabular-nums"
      >
        {count}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={busy}
        onClick={() => change(count + 1)}
        className={btn}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}