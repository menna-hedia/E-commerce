'use client'
import { addProductToCart } from '_/app/cart/cart.actions'
import { Button } from '_/components/ui/button'
import { MouseEvent, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  id: string
}

export default function AddToCartButton({ id }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick(e: MouseEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await addProductToCart(id)

    if (res instanceof Error || !res) {
      toast.error('Failed to add to cart')
    } else {
      toast.success('Added to cart')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Button className="w-full" onClick={handleClick} disabled={loading}>
      {loading ? 'Adding...' : 'Add To Cart'}
    </Button>
  )
}
