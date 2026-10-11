'use server'

import { revalidatePath } from "next/cache"
import { authedRequest, messageOf } from "_/api/authedRequest"
import { ActionResult } from "_/api/types"

export async function updateProfile(data: {
  name: string
  email: string
  phone?: string
}): Promise<ActionResult> {
  const body: Record<string, string> = { name: data.name, email: data.email }
  if (data.phone) body.phone = data.phone

  const { ok, json } = await authedRequest("/users/updateMe", "PUT", body)
  return { ok, message: ok ? "Profile updated" : messageOf(json, "Could not update your profile") }
}

export async function changePassword(data: {
  currentPassword: string
  password: string
  rePassword: string
}): Promise<ActionResult> {
  const { ok, json } = await authedRequest("/users/changeMyPassword", "PUT", data)
  return { ok, message: ok ? "Password changed" : messageOf(json, "Could not change your password") }
}

export async function addAddress(data: {
  name: string
  details: string
  phone: string
  city: string
}): Promise<ActionResult> {
  const { ok, json } = await authedRequest("/addresses", "POST", data)
  if (ok) revalidatePath("/profile")
  return { ok, message: ok ? "Address added" : messageOf(json, "Could not add the address") }
}

export async function removeAddress(id: string): Promise<ActionResult> {
  const { ok, json } = await authedRequest(`/addresses/${id}`, "DELETE")
  if (ok) revalidatePath("/profile")
  return { ok, message: ok ? "Address removed" : messageOf(json, "Could not remove the address") }
}