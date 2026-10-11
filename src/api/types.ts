export interface CategoryType {
  _id: string
  name: string
  slug: string
  image: string
}

export interface SubCategoryType {
  _id: string
  name: string
  slug: string
  category: string
}

export interface BrandType {
  _id: string
  name: string
  slug: string
  image: string
}

export interface ProductType {
  _id: string
  title: string
  images: string[]
  imageCover: string
  description: string
  sold: number
  quantity: number
  price: number
  priceAfterDiscount?: number
  ratingsAverage: number
  ratingsQuantity: number
  category: CategoryType
  brand: BrandType
}

export interface PaginationMeta {
  currentPage: number
  numberOfPages: number
  limit: number
  nextPage?: number
  prevPage?: number
}

export interface ProductsResponse {
  data: ProductType[]
  metadata?: PaginationMeta
}

export interface ProductQuery {
  page?: number
  limit?: number
  keyword?: string
  sort?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
}

export interface CartResponse {
  _id: string
  cartOwner: string
  products: ItemType[]
  totalCartPrice: number
}

export interface ItemType {
  count: number
  _id: string
  price: number
  product: ProductType
}

export interface ShippingAddressType {
  details: string
  phone: string
  city: string
  postalCode?: string
}

export interface OrderPlaceType {
  shippingAddress: ShippingAddressType
}

export interface AddressType {
  _id: string
  name: string
  details: string
  phone: string
  city: string
}

export interface ReviewType {
  _id: string
  review: string
  rating: number
  product: string
  user: { _id: string; name: string }
  createdAt: string
}

export interface OrderItemType {
  _id: string
  count: number
  price: number
  product?: {
    _id: string
    title: string
    imageCover: string
  }
}

export interface OrderType {
  _id: string
  id?: number
  totalOrderPrice: number
  shippingPrice?: number
  taxPrice?: number
  paymentMethodType: "cash" | "card"
  isPaid: boolean
  isDelivered: boolean
  createdAt: string
  shippingAddress?: Partial<ShippingAddressType>
  cartItems: OrderItemType[]
}

export type ActionResult = { ok: boolean; message: string }