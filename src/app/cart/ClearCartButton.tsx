"use client"

import { Button } from "_/components/ui/button"
import { clearCart } from "_/app/cart/cart.actions"
import { useRouter } from "next/navigation";
// import { useContext } from "react"
// import { CartContext } from "_/context/cartCotext"

export default function ClearCartButton() {
//   const { setNumberOfCartItems } = useContext(CartContext)
  const router = useRouter();
  async function handleClear() {
    await clearCart()
 router.refresh(); 
    // setNumberOfCartItems(0)
  }

  return (
    <Button
      onClick={handleClear}
      className="bg-red-600 text-white"
    >
      Clear Cart
    </Button>
  )
}