'use client'
import { addProductToCart } from '_/app/cart/cart.actions'
import { Button } from '_/components/ui/button'
import { MouseEvent } from 'react'
// import { useRouter } from "next/navigation";
interface AddToCartButtonProps {
    id: string
}
export default function AddToCartButton({ id }: AddToCartButtonProps) {
  // const router = useRouter();
  async function handleClick(e: MouseEvent) {
    e.preventDefault()
    await addProductToCart(id);
    //  router.refresh(); 
  }

  return (
    <Button className="w-full" onClick={ handleClick }>Add To Cart</Button>
  )
}
