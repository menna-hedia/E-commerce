import { getAllCategories, getAllProducts } from "_/api/services/routeServices"
// import { ProductType } from "_/api/types"
import { ProductCard } from "./_components/ProductCard/ProductCard"
import { HeroSlider } from './_components/HeroSlider/HeroSlider';
import { ShopByCategory } from './_components/ShopByCategory/ShopByCategory';
import { getUserWishlist } from "./../app/wishlist/wishlist.actions";

export default async function HomePage() {
const [products, wishlist] = await Promise.all([
    getAllProducts(),
    getUserWishlist()
  ]);
const categories = await getAllCategories()

const wishlistIds = wishlist ? wishlist.map((item: any) => item._id) : [];
  return (
    
    <div className="px-6 md:px-10">

      <HeroSlider />

      <h2 className="text-2xl font-bold mt-10 mb-6">
        Shop By <span className="text-[#00A63E]">Category</span>
      </h2>
<ShopByCategory categories={categories} loading={!categories} />


      <h2 className="text-2xl font-bold mt-12 mb-6">
        Featured <span className="text-[#00A63E]">Products</span>
      </h2>

      <div className="grid gap-6 w-full max-w-7xl mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {products?.map((product) => (
    <ProductCard 
      product={product} 
      key={product._id} 
      isInWishlist={wishlistIds.includes(product._id)} 
    />
  ))}
</div>

    </div>
  )
}