"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "_/lib/utils"

type Props = {
  value: number
  onChange?: (value: number) => void
  size?: number
  className?: string
}

export default function StarRating({ value, onChange, size = 18, className }: Props) {
  const [hover, setHover] = useState(0)
  const interactive = Boolean(onChange)
  const shown = hover || value

  return (
    <div
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Your rating" : `${value} out of 5 stars`}
      className={cn("flex items-center gap-0.5", className)}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors duration-150",
              n <= Math.round(shown) ? "fill-marigold text-marigold" : "text-border"
            )}
          />
        )

        return interactive ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => setHover(n)}
            className="rounded p-0.5 transition-transform duration-150 hover:scale-125 active:scale-90"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        )
      })}
    </div>
  )
}