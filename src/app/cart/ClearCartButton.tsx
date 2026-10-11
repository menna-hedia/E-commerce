"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "_/components/ui/button"
import { clearCart } from "_/app/cart/cart.actions"
import { useRouter } from "next/navigation"

export default function ClearCartButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleClear() {
    setBusy(true)
    await clearCart()
    router.refresh()
    setBusy(false)
  }

  return (
    <Button
      variant="destructive"
      onClick={handleClear}
      disabled={busy}
      className="h-9 rounded-full px-4 active:scale-95"
    >
      <Trash2 className="size-4" />
      Clear cart
    </Button>
  )
}