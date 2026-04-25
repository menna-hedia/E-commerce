'use client'

import { removeFromCart } from "./cart.actions";
import { useRouter } from "next/navigation";

export default function RemoveButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleRemove() {
    await removeFromCart(id);
    router.refresh(); 
  }

  return (
    <button
      onClick={handleRemove}
      className="text-red-500 text-sm hover:underline"
    >
      Remove
    </button>
  );
}