import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

async function readSessionToken() {
  const cookie = await cookies();

  const nextAuthToken =
    cookie.get("__Secure-next-auth.session-token")?.value ??
    cookie.get("next-auth.session-token")?.value;

  if (!nextAuthToken) return null;

  return decode({
    secret: process.env.NEXTAUTH_SECRET!,
    token: nextAuthToken,
  });
}

export async function decodeAuthenticatedUserToken(): Promise<string | null> {
  const jwtRes = await readSessionToken();
  return jwtRes ? (jwtRes.routeToken as string) : null;
}

export async function getSessionUserId(): Promise<string | null> {
  const jwtRes = await readSessionToken();
  return jwtRes ? ((jwtRes.id as string) ?? null) : null;
}