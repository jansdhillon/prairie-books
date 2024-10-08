import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCartItemsAction } from "../actions/get-cart-items";
import { removeFromCartAction } from "../actions/remove-from-cart";
import { SubmitButton } from "@/components/submit-button";

export default async function CartPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { cartItems } = await getCartItemsAction(user.id);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <h2 className="text-xl font-semibold">Your cart is empty.</h2>
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (total: number, item: any) => total + item.quantity * item.book.price,
    0
  );

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-3xl font-bold text-left">Your Cart</h1>

      <p className="text-lg text-muted-foreground">
        Review and manage the items in your cart.
      </p>

      <Table className="border-2 rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.book.title}</TableCell>
              <TableCell>${item.book.price.toFixed(2)}</TableCell>
              <TableCell>
                <form>
                  <input type="hidden" name="cartItemId" value={item.id} />
                  <SubmitButton
                    type="submit"
                    variant="destructive"
                    size="sm"
                    formAction={removeFromCartAction}
                    pendingText="Removing..."
                  >
                    Remove
                  </SubmitButton>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            Total: ${totalAmount.toFixed(2)} CAD
          </h3>
        </div>

        <Link href="/checkout">
          <Button variant={"default"}>Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
