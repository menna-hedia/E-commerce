'use client'

import { addProductToCart } from '_/app/cart/cart.actions'
import { Button } from '_/components/ui/button'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Check, Loader2, ShoppingBag } from 'lucide-react'
import { cn } from '_/lib/utils'

interface AddToCartButtonProps {
  id: string
  disabled?: boolean
}

type Status = 'idle' | 'loading' | 'done'

export default function AddToCartButton({ id, disabled = false }: AddToCartButtonProps) {
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const { status: sessionStatus } = useSession()

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  async function handleClick(e: MouseEvent) {
    e.preventDefault()
    if (status !== 'idle') return

    if (sessionStatus === 'unauthenticated') {
      toast.info('Sign in to add items to your cart', {
        action: { label: 'Sign in', onClick: () => router.push('/login') },
      })
      return
    }

    setStatus('loading')
    const res = await addProductToCart(id)

    if (res instanceof Error || !res) {
      toast.error('Failed to add to cart')
      setStatus('idle')
      return
    }

    toast.success('Added to cart')
    router.refresh()
    setStatus('done')
    timer.current = setTimeout(() => setStatus('idle'), 1800)
  }

  if (disabled) {
    return (
      <Button disabled className="h-10 w-full rounded-xl text-sm font-semibold">
        Out of stock
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={status === 'loading'}
      className={cn(
        'h-10 w-full rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98]',
        status === 'done' && 'bg-deep text-white hover:bg-deep'
      )}
    >
      <span
        key={status}
        className="inline-flex items-center gap-2 animate-in fade-in zoom-in-90 duration-300"
      >
        {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
        {status === 'done' && <Check className="size-4" />}
        {status === 'idle' && <ShoppingBag className="size-4" />}
        {status === 'loading' ? 'Adding...' : status === 'done' ? 'Added' : 'Add to cart'}
      </span>
    </Button>
  )
}