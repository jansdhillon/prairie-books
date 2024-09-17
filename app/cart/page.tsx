import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Database } from "@/utils/database.types";
import { fixOneToOne } from "../fixOneToOne";
import { getCartItemsAction } from "../actions/get-cart-items";
import { removeFromCartAction } from "../actions/remove-from-cart";
import { checkoutAction } from "../actions/checkout";
import Link from "next/link";

export type CartItemType = Database["public"]["Tables"]["cart_items"]["Row"]

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
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-semibold">Your cart is empty.</h2>
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (total: number, item: CartItemType) =>
      total + item.quantity * item.book.price,
    0
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      <table className="table-auto w-full mb-6">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Book</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item: CartItemType) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.book.title}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">
                ${item.book.price.toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                ${(item.book.price * item.quantity).toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                <form action={removeFromCartAction}>
                  <input type="hidden" name="cartItemId" value={item.id} />
                  <Button type="submit" variant="destructive">
                    Remove
                  </Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
