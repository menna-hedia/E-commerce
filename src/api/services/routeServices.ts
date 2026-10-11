import {
  AddressType,
  BrandType,
  CartResponse,
  CategoryType,
  OrderType,
  ProductQuery,
  ProductsResponse,
  ProductType,
  ReviewType,
  SubCategoryType,
} from "../types"
import { decodeAuthenticatedUserToken, getSessionUserId } from "_/app/utils"

const API = "https://ecommerce.routemisr.com/api"

const FIVE_MINUTES = 60 * 5
const ONE_HOUR = 60 * 60

/** GET for public data. Cached by Next so repeat visits are instant. */
async function publicGet<T>(path: string, revalidate = FIVE_MINUTES): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate } })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch (error) {
    console.log("error fetching", path, error)
    return null
  }
}

/** GET for the signed-in user. Never cached. */
async function authedGet<T>(path: string): Promise<T | null> {
  const token = await decodeAuthenticatedUserToken()
  if (!token) return null

  try {
    const res = await fetch(`${API}${path}`, {
      headers: { token },
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch (error) {
    console.log("error fetching", path, error)
    return null
  }
}

/* ---------------------------- Products ---------------------------- */

function toQueryString(q: ProductQuery) {
  const p = new URLSearchParams()
  if (q.page) p.set("page", String(q.page))
  if (q.limit) p.set("limit", String(q.limit))
  if (q.keyword) p.set("keyword", q.keyword)
  if (q.sort) p.set("sort", q.sort)
  if (q.category) p.set("category[in]", q.category)
  if (q.brand) p.set("brand", q.brand)
  if (q.minPrice) p.set("price[gte]", String(q.minPrice))
  if (q.maxPrice) p.set("price[lte]", String(q.maxPrice))
  return p.toString()
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductsResponse> {
  const qs = toQueryString(query)
  const json = await publicGet<ProductsResponse>(`/v1/products${qs ? `?${qs}` : ""}`)
  return { data: json?.data ?? [], metadata: json?.metadata }
}

export async function getAllProducts(): Promise<ProductType[] | undefined> {
  const { data } = await getProducts()
  return data
}

export async function getProduct(id: string): Promise<ProductType | null> {
  const json = await publicGet<{ data?: ProductType }>(`/v1/products/${id}`)
  return json?.data ?? null
}

/* ---------------------------- Reviews ---------------------------- */

export async function getProductReviews(productId: string): Promise<ReviewType[]> {
  const json = await publicGet<{ data?: ReviewType[] }>(`/v1/products/${productId}/reviews`, 0)
  return json?.data ?? []
}

/* --------------------------- Categories --------------------------- */

export async function getAllCategories(): Promise<CategoryType[] | undefined> {
  const json = await publicGet<{ data: CategoryType[] }>(`/v1/categories`, ONE_HOUR)
  return json?.data
}

export async function getCategoryDetails(id: string): Promise<CategoryType | null> {
  const json = await publicGet<{ data: CategoryType }>(`/v1/categories/${id}`, ONE_HOUR)
  return json?.data ?? null
}

export async function getSubCategoriesOnCategory(categoryId: string): Promise<SubCategoryType[]> {
  const json = await publicGet<{ data: SubCategoryType[] }>(
    `/v1/categories/${categoryId}/subcategories`,
    ONE_HOUR
  )
  return json?.data ?? []
}

/* ------------------------- Sub categories ------------------------- */

export async function getAllSubCategories(): Promise<SubCategoryType[]> {
  const json = await publicGet<{ data: SubCategoryType[] }>(`/v1/subcategories`, ONE_HOUR)
  return json?.data ?? []
}

export async function getSubCategory(id: string): Promise<SubCategoryType | null> {
  const json = await publicGet<{ data: SubCategoryType }>(`/v1/subcategories/${id}`, ONE_HOUR)
  return json?.data ?? null
}

/* ----------------------------- Brands ----------------------------- */

export async function getAllBrands(): Promise<BrandType[] | undefined> {
  const json = await publicGet<{ data: BrandType[] }>(`/v1/brands`, ONE_HOUR)
  return json?.data
}

export async function getBrandDetails(id: string): Promise<BrandType | null> {
  const json = await publicGet<{ data: BrandType }>(`/v1/brands/${id}`, ONE_HOUR)
  return json?.data ?? null
}

/* ------------------------ Signed-in user data ------------------------ */

export async function getUserCart(): Promise<CartResponse | undefined> {
  const json = await authedGet<{ data?: CartResponse }>(`/v2/cart`)
  return json?.data
}

export async function getUserAddresses(): Promise<AddressType[]> {
  const json = await authedGet<{ data?: AddressType[] }>(`/v1/addresses`)
  return json?.data ?? []
}

export async function getUserOrders(): Promise<OrderType[]> {
  const userId = await getSessionUserId()
  if (!userId) return []

  // Route returns a bare array here, but handle { data: [] } too.
  const json = await authedGet<OrderType[] | { data?: OrderType[] }>(`/v1/orders/user/${userId}`)
  const list = Array.isArray(json) ? json : json?.data
  return (list ?? []).slice().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}