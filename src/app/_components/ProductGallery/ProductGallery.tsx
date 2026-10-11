"use client"

import { useState } from "react"
import { cn } from "_/lib/utils"

export default function ProductGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-4 md:sticky md:top-24 md:self-start">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted ring-1 ring-border">
        <img
          key={images[active]}
          src={images[active]}
          alt={title}
          className="size-full animate-in fade-in zoom-in-95 object-cover duration-500"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "aspect-square overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-background transition-all duration-300",
                i === active
                  ? "ring-brand"
                  : "opacity-70 ring-transparent hover:opacity-100"
              )}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}