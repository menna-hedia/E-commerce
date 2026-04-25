import { getProduct } from "_/api/services/routeServices"
import { Star } from "lucide-react"
import AddToCartButton from './../../_components/AddToCartButton/AddToCartButton';
import WishlistButton from "_/app/_components/WishListButton/WishListButton";
import { getUserWishlist } from "_/app/wishlist/wishlist.actions";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params


  const [product, wishlist] = await Promise.all([
    getProduct(id),
    getUserWishlist()
  ]);

  if (!product) {
    return <div className="p-10 text-center text-2xl">Product not found</div>
  }


  const isInWishlist = wishlist?.some((item: any) => item._id === product._id) || false;

  return (
    <div className="max-w-6xl m-10 p-5 mx-auto grid md:grid-cols-2 gap-10 border rounded-2xl bg-white shadow-sm">

      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="rounded-xl overflow-hidden border">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full object-cover"
          />
        </div>
        
      
      </div>

      {/* Info Content */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          
          {/* Wishlist Button */}
          <div className="p-1 border rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <WishlistButton 
              productId={product._id} 
              isInWishlistInitial={isInWishlist} 
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className="flex gap-3 text-sm">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            Category: <b>{product.category.name}</b>
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            Brand: <b>{product.brand.name}</b>
          </span>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const index = i + 1
            return (
              <Star
                key={i}
                size={20}
                className={
                  index <= Math.round(product.ratingsAverage)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            )
          })}
          <span className="text-sm text-gray-500 ml-2 font-medium">
            {product.ratingsAverage} | {product.ratingsQuantity} Reviews
          </span>
        </div>

        {/* Price & Stock */}
        <div className="space-y-1 border-y py-4">
          <p className="text-3xl font-bold text-green-700">
            {product.price.toLocaleString()} EGP
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Available in stock: <b>{product.quantity}</b></span>
            <span>Sold: <b>{product.sold}</b></span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Description:</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
  {/* Sub Images */}
        <div className="grid grid-cols-4 gap-2">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.title} ${i}`}
              className="h-24 w-full object-cover rounded-md border hover:opacity-80 cursor-pointer"
            />
          ))}
        </div>
        {/* Add to Cart */}
        <div className="mt-auto">
          <AddToCartButton id={product._id} />
        </div>

      </div>
    </div>
  )
}