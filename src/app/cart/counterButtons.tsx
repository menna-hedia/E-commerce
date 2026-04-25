'use client'

import { useRouter } from "next/navigation";
import { updateCartQuantity , removeFromCart } from "./cart.actions";

export default function QuantityButtons({ id, count }: { id: string, count: number }) {
  const router = useRouter();

  async function increase() {
    await updateCartQuantity(id, count + 1);
    router.refresh();
  }

  async function decrease() {
    if (count === 1) {await removeFromCart(id)}
    await updateCartQuantity(id, count - 1);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={decrease} className="px-2 bg-gray-200">-</button>
      <span>{count}</span>
      <button onClick={increase} className="px-2 bg-gray-200">+</button>
    </div>
  );
}