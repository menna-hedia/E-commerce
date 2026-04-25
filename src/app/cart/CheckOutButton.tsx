"use client";

import Link from "next/link";
import { Button } from "_/components/ui/button";

export default function CheckOutButton({ cartId }: { cartId: string }) {
   
  return (
    <Link href={`/cart/${cartId}`}>
      <Button className=" text-white mx-5">
        Check Out
      </Button>
    </Link>
  );
}