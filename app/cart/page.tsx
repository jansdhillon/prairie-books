"use client";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartItemType, EnhancedCartItemType } from "@/lib/types/types";
import { encodedRedirect } from "@/utils/utils";
import { loadStripe } from "@stripe/stripe-js";
import { startCheckoutAction } from "../actions/start-checkout";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<EnhancedCartItemType[] | [] | undefined>([]);
  const [totalAmount, setTotalAmount] = useState<number | undefined>(0);


  useEffect(() => {

    const fetchItems = async () => {
      const { amount, cartDetails } = await startCheckoutAction();
      setTotalAmount(amount);
      setCartItems(cartDetails);}
    fetchItems();



  }, [router]);

  // const handleRemoveFromCart = async (cartItemId: string) => {
  //   await removeFromCartAction(cartItemId);
  //   setCartItems(cartItems.filter((item) => item.id !== cartItemId));
  // };

  const handleCheckout = async () => {
    if (cartItems == undefined || !cartItems.length) return;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems, successUrl: window.location.origin }),
    });

    const { sessionId } = await response.json();
    if (sessionId) {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      await stripe?.redirectToCheckout({ sessionId });

    }
  };


  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <h2 className="text-xl font-semibold">Your cart is empty.</h2>
      </div>
    );
  }

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
                <Button
                  variant="destructive"
                  size="sm"
                  // onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            Total: ${totalAmount?.toFixed(2)} CAD
          </h3>
        </div>

        <Button variant="default" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
