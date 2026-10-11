'use server'

import { revalidatePath } from "next/cache"
import { authedRequest, messageOf } from "_/api/authedRequest"
import { ActionResult } from "_/api/types"

type ReviewInput = { review: string; rating: number }

export async function addReview(productId: string, data: ReviewInput): Promise<ActionResult> {
  const { ok, json } = await authedRequest(`/products/${productId}/reviews`, "POST", {
    ...data,
    product: productId,
  })
  if (ok) revalidatePath(`/products/${productId}`)
  return { ok, message: ok ? "Thanks for your review" : messageOf(json, "Could not add your review") }
}

export async function updateReview(
  reviewId: string,
  productId: string,
  data: ReviewInput
): Promise<ActionResult> {
  const { ok, json } = await authedRequest(`/reviews/${reviewId}`, "PUT", data)
  if (ok) revalidatePath(`/products/${productId}`)
  return { ok, message: ok ? "Review updated" : messageOf(json, "Could not update your review") }
}

export async function deleteReview(reviewId: string, productId: string): Promise<ActionResult> {
  const { ok, json } = await authedRequest(`/reviews/${reviewId}`, "DELETE")
  if (ok) revalidatePath(`/products/${productId}`)
  return { ok, message: ok ? "Review deleted" : messageOf(json, "Could not delete your review") }
}