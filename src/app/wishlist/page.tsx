import { ProductCard } from "../_components/ProductCard/ProductCard";
import { getUserWishlist } from "./wishlist.actions";

export default async function WishlistPage() {
  const wishlistItems = await getUserWishlist();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500">
    Your wishlist is empty
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">My <span className="text-red-600">Wishlist</span></h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product: any) => (
          <div key={product._id} className="relative group">
            <ProductCard 
              product={product} 

              isInWishlist={true} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}