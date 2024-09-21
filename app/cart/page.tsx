import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Database } from "@/utils/database.types";
import { fixOneToOne } from "../fixOneToOne";
import { getCartItemsAction } from "../actions/get-cart-items";
import { removeFromCartAction } from "../actions/remove-from-cart";
import { checkoutAction } from "../actions/checkout";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";


export default async function CartPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { cartItems } = await getCartItemsAction();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 flex  w-full justify-center">
        <h2 className="text-xl font-semibold">Your cart is empty.</h2>
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (total: number, item:any) =>
      total + item.quantity * item.book.price,
    0
  );

  return (
    <div className="container mx-auto p-6 flex w-full ">
      <h2 className=" font-semibold mb-4">Your Cart</h2>
      <Table className="table-auto w-full mb-6">
        <TableHead>
          <TableRow>
            <TableHead className="px-4 py-2 text-left">Book</TableHead>
            <TableHead className="px-4 py-2 text-left">Quantity</TableHead>
            <TableHead className="px-4 py-2 text-left">Price</TableHead>
            <TableHead className="px-4 py-2 text-left">Total</TableHead>
            <TableHead className="px-4 py-2 text-left">Actions</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.map((item:any) => (
            <TableRow key={item.id}>
              <TableCell className="border px-4 py-2">{item.book.title}</TableCell>
              <TableCell className="border px-4 py-2">{item.quantity}</TableCell>
              <TableCell className="border px-4 py-2">
                ${item.book.price.toFixed(2)}
              </TableCell>
              <TableCell className="border px-4 py-2">
                ${(item.book.price * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell className="border px-4 py-2">
                <form action={removeFromCartAction}>
                  <input type="hidden" name="cartItemId" value={item.id} />
                  <Button type="submit" variant="destructive">
                    Remove
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Total: ${totalAmount.toFixed(2)}
        </h3>

          <Link href="/checkout">
            Proceed to Checkout
          </Link>

      </div>
    </div>
  );
}
