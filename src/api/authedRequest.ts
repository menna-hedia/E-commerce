import { decodeAuthenticatedUserToken } from "_/app/utils"

const API = "https://ecommerce.routemisr.com/api/v1"

export type ApiResult = { ok: boolean; json: any }

export async function authedRequest(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<ApiResult> {
  const token = await decodeAuthenticatedUserToken()
  if (!token) return { ok: false, json: { message: "Your session has ended. Please sign in again." } }

  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { token, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    })
    const json = await res.json().catch(() => ({}))
    return { ok: res.ok, json }
  } catch {
    return { ok: false, json: { message: "Network error. Please try again." } }
  }
}

export async function publicRequest(
  path: string,
  method: "POST" | "PUT",
  body: unknown
): Promise<ApiResult> {
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const json = await res.json().catch(() => ({}))
    return { ok: res.ok, json }
  } catch {
    return { ok: false, json: { message: "Network error. Please try again." } }
  }
}

export function messageOf(json: any, fallback: string): string {
  return json?.errors?.msg || json?.message || fallback
}