import { ProductType ,CategoryType ,CartResponse} from "../types";
import { decodeAuthenticatedUserToken } from "_/app/utils";

export async function getAllProducts(): Promise<ProductType[] | undefined>
  {
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products`);
      const finalRes = await res.json();
      return finalRes.data;

    } catch (error) {
      console.log("error", error);
    }
  }

export async function getProduct(id: string) {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`
    )

    if (!res.ok) {
      throw new Error("Failed to fetch product")
    }

    const data = await res.json()

    if (!data || !data.data) return null

    return data.data
  } catch (error) {
    console.log("error", error)
    return null
  }
}

export async function getAllCategories(): Promise<CategoryType[] | undefined> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories`,
    )

    const finalRes = await res.json()
    return finalRes.data

  } catch (error) {
    console.log("error", error)
  }
}

export async function getCategoryDetails(id: string) {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${id}`
    );

    if (!res.ok) return null;

    const result = await res.json();
    return result.data; 
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getSubCategoriesOnCategory(categoryId: string) {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`
    );

    if (!res.ok) return [];

    const result = await res.json();
    return result.data; 
  } catch (error) {
    console.log("error fetching subcategories", error);
    return [];
  }
}

export async function getAllBrands(): Promise<BrandType[] | undefined> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`);
    const finalRes = await res.json();
    return finalRes.data;
  } catch (error) {
    console.log("error fetching brands", error);
  }
}

export async function getBrandDetails(id: string) {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);
    if (!res.ok) return null;
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.log("error fetching brand details", error);
    return null;
  }
}
export async function getUserCart(): Promise<CartResponse | undefined> {
  const userToken = await decodeAuthenticatedUserToken();

  if (!userToken) return;

  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v2/cart', {
      headers: { token: userToken },
      cache: "no-store"
    });

    const finalRes = await res.json();
    return finalRes.data;

  } catch (error) {
    console.log("error", error);
  }
}