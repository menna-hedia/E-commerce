export interface CategoryType {
  _id: string
  name: string
  slug: string
  image: string
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
  sold : number
  quantity: number
  price: number
  ratingsAverage: number
  ratingsQuantity: number
  category: CategoryType
  brand: BrandType
}
export interface CartResponse {
  _id: string;
  cartOwner: string;
  products: ItemType[];
  totalCartPrice: number;
}

export interface ItemType {
  count: number;
  _id: string;
  price: number;
  product: ProductType;
}
export interface OrderPlaceType {
  shippingAddress: {
    details: string,
    phone: string,
    city: string,
    postalCode: string
  }}