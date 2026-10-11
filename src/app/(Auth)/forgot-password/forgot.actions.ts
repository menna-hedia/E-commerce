'use server'

import { messageOf, publicRequest } from "_/api/authedRequest"
import { ActionResult } from "_/api/types"

export async function forgotPassword(email: string): Promise<ActionResult> {
  const { ok, json } = await publicRequest("/auth/forgotPasswords", "POST", { email })
  return { ok, message: ok ? "We sent a code to your email" : messageOf(json, "We couldn't find that email") }
}

export async function verifyResetCode(resetCode: string): Promise<ActionResult> {
  const { ok, json } = await publicRequest("/auth/verifyResetCode", "POST", { resetCode })
  return { ok, message: ok ? "Code verified" : messageOf(json, "That code is wrong or expired") }
}

export async function resetPassword(email: string, newPassword: string): Promise<ActionResult> {
  const { ok, json } = await publicRequest("/auth/resetPassword", "PUT", { email, newPassword })
  return { ok, message: ok ? "Password updated" : messageOf(json, "Could not reset your password") }
}