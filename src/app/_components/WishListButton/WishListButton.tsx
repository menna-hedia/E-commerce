"use client"

import { useState } from "react"
import { addToWishlist, removeFromWishlist } from "./../../wishlist/wishlist.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { cn } from "_/lib/utils"

export default function WishlistButton({
  productId,
  isInWishlistInitial,
}: {
  productId: string
  isInWishlistInitial: boolean
}) {
  const [isLiked, setIsLiked] = useState(isInWishlistInitial)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggleWishlist() {
    setLoading(true)
    if (isLiked) {
      await removeFromWishlist(productId)
      setIsLiked(false)
      toast.info("Removed from wishlist")
    } else {
      const res = await addToWishlist(productId)
      if (res.status === "success") {
        setIsLiked(true)
        toast.success("Added to wishlist")
      }
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      className="group grid size-10 place-items-center rounded-full bg-background/90 shadow-sm ring-1 ring-border backdrop-blur transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-60"
    >
      <Heart
        className={cn(
          "size-5 transition-colors duration-200",
          isLiked
            ? "animate-heart fill-red-500 text-red-500"
            : "text-foreground/50 group-hover:text-red-500"
        )}
      />
    </button>
  )
}