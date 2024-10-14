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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnhancedCartItemType } from "@/lib/types/types";
import { startCheckoutAction } from "../actions/start-checkout";
import { removeFromCartAction } from "../actions/remove-from-cart";
import { getStripe } from "@/utils/stripe/client";
import Loading from "../loading";
import { postData } from "@/utils/helpers";
import { set } from "date-fns";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<
    EnhancedCartItemType[] | undefined
  >();
  const [totalAmount, setTotalAmount] = useState<number | undefined>(0);
  const [userId, setUserId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const { amount, cartDetails, userData } = await startCheckoutAction();
        if (!userData) {
          router.push("/sign-in");
          return;
        }
        setUserId(userData.id);

        setTotalAmount(amount);
        setCartItems(cartDetails);
      } catch (error: any) {
        console.error("Error fetching cart items:", error?.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [router]);

  const handleRemoveFromCart = async (cartItemId: string) => {
    await removeFromCartAction(cartItemId);
    setCartItems(cartItems?.filter((item) => item.id !== cartItemId));
  };

  const handleCheckout = async () => {
    if (cartItems == undefined || !cartItems.length) return;

    const { sessionId } = await postData({
      url: "/api/create-checkout-session",
      data: {
        cartItems,
        total: totalAmount,
        userId,
      },
    });
    if (sessionId) {
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-3xl font-bold text-left">Your Cart</h1>

      <p className="text-lg text-muted-foreground">
        Review and manage the items in your cart.
      </p>

      {isLoading ? (
        <Loading />
      ) : cartItems?.length ? (
        <>
          <Table className="border-2 rounded-xl">
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cartItems?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.book.title}</TableCell>
                  <TableCell>${item.book.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.id)}
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
        </>
      ) : (
        <div className="text-lg text-muted-foreground">Your cart is empty.</div>
      )}
    </div>
  );
}
