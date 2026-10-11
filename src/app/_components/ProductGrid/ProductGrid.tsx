import { ProductType } from "_/api/types"
import { ProductCard } from "../ProductCard/ProductCard"
import Reveal from "../Reveal/Reveal"

type Props = {
  products: ProductType[]
  wishlistIds: string[]
}

export default function ProductGrid({ products, wishlistIds }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <Reveal key={product._id} delay={(i % 4) * 70} className="h-full">
          <ProductCard
            product={product}
            isInWishlist={wishlistIds.includes(product._id)}
          />
        </Reveal>
      ))}
    </div>
  )
}