"use client"

import { useState } from "react";
import { addToWishlist, removeFromWishlist } from "./../../wishlist/wishlist.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";


export default function WishlistButton({ productId, isInWishlistInitial }: { productId: string, isInWishlistInitial: boolean }) {
  const [isLiked, setIsLiked] = useState(isInWishlistInitial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleWishlist() {
    setLoading(true);
    if (isLiked) {
      await removeFromWishlist(productId);
      setIsLiked(false);
      toast.info("Removed from wishlist");
    } else {
  
      const res = await addToWishlist(productId);
      if (res.status === "success") {
        setIsLiked(true);
        toast.success("Added to wishlist ");
      }
    }
    setLoading(false);
    router.refresh(); 
  }

  return (
    <button 
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${loading ? 'opacity-50' : ''}`}
    >
     <Heart 
  size={24} 
  fill={isLiked ? "red" : "none"} 
  className={isLiked ? "text-red-500" : "text-gray-400"} 
/>
    </button>
  );
}