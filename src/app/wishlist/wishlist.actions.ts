'use server';

import { decodeAuthenticatedUserToken } from "../utils";

export async function addToWishlist(productId: string) {
  const userToken = await decodeAuthenticatedUserToken();
  if (!userToken) return { status: "error", message: "Session expired" };

  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
      method: "POST",
      headers: { token: userToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    return await res.json();
  } catch (error) {
    return { status: "error", error };
  }
}

export async function removeFromWishlist(productId: string) {
  const userToken = await decodeAuthenticatedUserToken();
  if (!userToken) return;

  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      method: "DELETE",
      headers: { token: userToken }
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
export async function getUserWishlist() {
  const userToken = await decodeAuthenticatedUserToken();
  if (!userToken) return null;

  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
      headers: { token: userToken },
      cache: 'no-store'
    });
    const finalRes = await res.json();
    return finalRes.data;
  } catch (error) {
    return null;
  }
}