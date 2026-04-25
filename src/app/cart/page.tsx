import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "_/components/ui/table";

import { getUserCart } from "_/api/services/routeServices";
import RemoveButton from "./RemoveButton";
import QuantityButtons from './counterButtons';
import Link from "next/link"
import ClearCartButton from "./ClearCartButton";
// import { CartResponse, ProductType } from '_/api/types';
// import CheckOutButton from "./CheckOutButton";
import { Button } from "_/components/ui/button";

export default async function CartPage() {
  const cart = await getUserCart();
 
  
  if (!cart || !cart.products?.length) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Your cart is empty
      </div>
    );
  }
const cartData = cart as CartResponse | undefined;
const cartId = cartData?._id;

  return (
    <div className=" w-300 mx-auto mt-10 px-4">
      <div className="flex justify-between">
      <h1 className="text-2xl font-bold mb-6">Your <span className="text-[#00A63E]">Cart</span></h1>
    <div>
        {/* <CheckOutButton/> */}
        <Link href={`/cart/${cartId}`}>
      <Button className=" text-white mx-5">
        Check Out
      </Button>
    </Link>
<ClearCartButton />
    </div>
</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cart.products.map((item:any) => (
            <TableRow key={item._id}>

              {/* Product */}
              <TableCell className="flex items-center gap-3 overflow-hidden max-w-2xl">

                <Link href={`/products/${item.product._id}`} className="flex items-center gap-3">

                  <img
                    src={item.product.imageCover}
                    className="w-16 h-16 rounded object-cover"
                  />

                  <span>{item.product.title}</span>

                </Link>

              </TableCell>

              {/* Price */}
              <TableCell>{item.price} EGP</TableCell>

              {/* Quantity */}
              <TableCell>
                <QuantityButtons id={item.product._id} count={item.count} />
              </TableCell>

              {/* Total */}
              <TableCell>
                {item.price * item.count} EGP
              </TableCell>

              {/* Remove */}
              <TableCell>
                <RemoveButton id={item.product._id} />
              </TableCell>

            </TableRow>
          ))}
        </TableBody>


        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Price</TableCell>
            <TableCell>{cart.totalCartPrice} EGP</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}