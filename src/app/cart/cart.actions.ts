'use server';

import { OrderPlaceType } from "_/api/types";
import { decodeAuthenticatedUserToken } from "../utils";

export async function addProductToCart(id: string) {
    const bodyObj = { productId: id };
  const userToken = await decodeAuthenticatedUserToken();

  if (userToken) {
    try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v2/cart', {
            method: "post",
            headers: { token: userToken, 'content-type': 'application/json' },
            body: JSON.stringify(bodyObj)
        })

        const finalRes = await res.json();
     
return finalRes;
    } catch (error) {
        console.log('err', error);
    }
 } else {
    return new Error("Session ended");
  }
}

export async function removeFromCart(productId: string) {
  const token = await decodeAuthenticatedUserToken();

  if (!token) throw new Error("Session expired");

  await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
    method: "DELETE",
    headers: { token }
  });
}

export async function updateCartQuantity(productId: string, count: number) {
  const token = await decodeAuthenticatedUserToken();

  if (!token) throw new Error("Session expired");

  await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
    method: "PUT",
    headers: {
      token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ count }),
  });
}

export async function clearCart() {
  const token = await decodeAuthenticatedUserToken();

  if (!token) throw new Error("Session expired");

  const res = await fetch(
    "https://ecommerce.routemisr.com/api/v2/cart",
    {
      method: "DELETE",
      headers: {
        token,
      },
    }
  );

  return await res.json();
}

export async function createCashOrder(cartId: string, bodyObject: OrderPlaceType ) {
  const token = await decodeAuthenticatedUserToken();
  if (token) {
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v2/orders/${cartId}`, {
        method: "post",
        headers: { token: token, "content-type": "application/json" },
        body: JSON.stringify(bodyObject)
      });

      if (res.ok) {
        const finalRes = await res.json();
        return finalRes;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}

export async function createOnlineOrderAction(cartId: string, bodyObject: OrderPlaceType) {
  const token = await decodeAuthenticatedUserToken();
  if (token) {
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`, {
        method: "post",
        headers: { token: token, "content-type": "application/json" },
        body: JSON.stringify(bodyObject)
      });

      if (res.ok) {
        const finalRes = await res.json();
        return finalRes.session.url;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}