"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { ReviewType } from "_/api/types"
import StarRating from "../StarRating/StarRating"
import { addReview, deleteReview, updateReview } from "_/app/products/[id]/review.actions"

type Props = {
  productId: string
  reviews: ReviewType[]
  userId: string | null
  average: number
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
}

type FormProps = {
  initialRating?: number
  initialText?: string
  submitLabel: string
  onSubmit: (rating: number, text: string) => Promise<boolean>
  onCancel?: () => void
}

function ReviewForm({ initialRating = 0, initialText = "", submitLabel, onSubmit, onCancel }: FormProps) {
  const [rating, setRating] = useState(initialRating)
  const [text, setText] = useState(initialText)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) return setError("Choose a rating from 1 to 5 stars.")
    if (text.trim().length < 3) return setError("Write at least 3 characters.")

    setError("")
    setBusy(true)
    const ok = await onSubmit(rating, text.trim())
    setBusy(false)

    if (ok && !initialText) {
      setRating(0)
      setText("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StarRating value={rating} onChange={setRating} size={26} />

      <div>
        <label htmlFor="review-text" className="mb-1.5 block text-sm font-medium">
          Your review
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="What did you like or dislike?"
          className="w-full resize-none rounded-xl border border-input bg-card p-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand focus:ring-4 focus:ring-brand/15"
        />
        {error && (
          <p className="mt-1.5 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-all duration-200 hover:bg-brand/90 active:scale-95 disabled:opacity-70"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-full px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default function ReviewsSection({ productId, reviews, userId, average }: Props) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const mine = userId ? reviews.find((r) => r.user?._id === userId) : undefined
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }))

  function report(res: { ok: boolean; message: string }) {
    if (res.ok) {
      toast.success(res.message)
      router.refresh()
    } else {
      toast.error(res.message)
    }
    return res.ok
  }

  async function handleAdd(rating: number, text: string) {
    return report(await addReview(productId, { rating, review: text }))
  }

  async function handleUpdate(id: string, rating: number, text: string) {
    const ok = report(await updateReview(id, productId, { rating, review: text }))
    if (ok) setEditingId(null)
    return ok
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    report(await deleteReview(id, productId))
    setDeletingId(null)
  }

  return (
    <section id="reviews" className="scroll-mt-24">
      <h2 className="font-heading text-2xl font-bold md:text-3xl">Customer reviews</h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
            <div className="flex items-end gap-3">
              <span className="font-heading text-5xl font-bold leading-none">
                {average ? average.toFixed(1) : "-"}
              </span>
              <div className="pb-1">
                <StarRating value={average} />
                <p className="mt-1 text-sm text-muted-foreground">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-2">
              {counts.map(({ star, count }) => (
                <li key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-3 text-muted-foreground">{star}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span
                      className="block h-full rounded-full bg-marigold transition-[width] duration-700 ease-out"
                      style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                    />
                  </span>
                  <span className="w-5 text-right tabular-nums text-muted-foreground">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          {!userId ? (
            <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <p className="font-semibold">Share your experience</p>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to write a review.</p>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(`/products/${productId}`)}`}
                className="mt-4 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition-all hover:bg-brand/90 active:scale-95"
              >
                Sign in
              </Link>
            </div>
          ) : !mine ? (
            <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <p className="mb-4 font-semibold">Write a review</p>
              <ReviewForm submitLabel="Post review" onSubmit={handleAdd} />
            </div>
          ) : null}
        </div>

        <div>
          {reviews.length === 0 ? (
            <p className="rounded-2xl bg-card p-8 text-center text-muted-foreground ring-1 ring-border">
              No reviews yet. Be the first to share what you think.
            </p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => {
                const isMine = userId !== null && r.user?._id === userId
                const editing = editingId === r._id

                return (
                  <li
                    key={r._id}
                    className="rounded-2xl bg-card p-5 ring-1 ring-border animate-in fade-in slide-in-from-bottom-2 duration-500"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-secondary font-heading font-bold text-brand">
                          {(r.user?.name ?? "?").charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">
                            {r.user?.name ?? "Customer"}
                            {isMine && (
                              <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                        </div>
                      </div>

                      {isMine && !editing && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            aria-label="Edit review"
                            onClick={() => setEditingId(r._id)}
                            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-90"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete review"
                            disabled={deletingId === r._id}
                            onClick={() => handleDelete(r._id)}
                            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 disabled:opacity-50"
                          >
                            {deletingId === r._id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {editing ? (
                      <div className="mt-4">
                        <ReviewForm
                          initialRating={r.rating}
                          initialText={r.review}
                          submitLabel="Save changes"
                          onSubmit={(rating, text) => handleUpdate(r._id, rating, text)}
                          onCancel={() => setEditingId(null)}
                        />
                      </div>
                    ) : (
                      <>
                        <StarRating value={r.rating} size={16} className="mt-4" />
                        <p className="mt-2 max-w-prose leading-relaxed text-muted-foreground">{r.review}</p>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}