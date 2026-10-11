"use client";

import Link from "next/link";
import { Button } from "_/components/ui/button";

export default function CheckOutButton({ cartId }: { cartId: string }) {
   
  return (
    <Link href={`/cart/${cartId}`}>
      <Button className=" mx-5">
        Check Out
      </Button>
    </Link>
  );
}