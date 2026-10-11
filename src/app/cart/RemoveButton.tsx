'use client'

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { removeFromCart } from "./cart.actions"
import { useRouter } from "next/navigation"

export default function RemoveButton({ id }: { id: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleRemove() {
    setBusy(true)
    await removeFromCart(id)
    router.refresh()
    setBusy(false)
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={busy}
      aria-label="Remove from cart"
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive active:scale-95 disabled:opacity-50"
    >
      <Trash2 className="size-4" />
      <span className="hidden sm:inline">Remove</span>
    </button>
  )
}