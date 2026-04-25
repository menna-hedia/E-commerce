import { Badge } from "_/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "_/components/ui/card"
import { Star } from "lucide-react"
import { ProductType } from "_/api/types"
import Link from "next/link"
import AddToCartButton from './../AddToCartButton/AddToCartButton';
import WishlistButton from "../WishListButton/WishListButton"

type Props = {
  product: ProductType;
  isInWishlist: boolean;
}

export function ProductCard({ product, isInWishlist }: Props) {
  return (
    <Card className="relative mx-auto w-full max-w-sm overflow-hidden pt-0">

      <div className="absolute top-2 right-2 z-10">
        <WishlistButton 
           productId={product._id} 
           isInWishlistInitial={isInWishlist} 
        />
      </div>

      <div className="relative">
        <Link href={`/products/${product._id}`} >
          <img
            src={product.imageCover}
            alt={product.title}
            className="aspect-square w-full object-cover"
          />
        </Link>

        <div className="absolute top-3 left-3">
          <Badge variant="secondary">
            {product.category?.name}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-base line-clamp-1">
          {product.title}
        </CardTitle>

        <CardDescription>
          <div className="flex items-center gap-2 mt-2">
  
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const index = i + 1
                return (
                  <Star
                    key={i}
                    size={16}
                    className={
                      index <= Math.round(product.ratingsAverage)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                )
              })}
            </div>

            <span className="text-sm text-gray-500">
              {product.ratingsAverage}
            </span>
            <span className="text-sm text-gray-500">
              ({product.ratingsQuantity})
            </span>
          </div>
        </CardDescription>

        <p className="font-bold text-green-600">
          {product.price} EGP
        </p>
      </CardHeader>


      <CardFooter>
        <AddToCartButton id={product._id}/>
      </CardFooter>

    </Card>
  )
}