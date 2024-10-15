"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnhancedCartItemType } from "@/lib/types/types";
import { startCheckoutAction } from "../actions/start-checkout";
import { removeFromCartAction } from "../actions/remove-from-cart";
import { getStripe } from "@/utils/stripe/client";
import Loading from "../loading";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Eye, Trash } from "lucide-react";
import { postData } from "@/utils/helpers";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<
    EnhancedCartItemType[] | undefined
  >();
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
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
        setInitialAmount(amount);
        const calculatedShipping = amount > 75 || !amount ? 0.0 : 15.0;
        setShippingCost(calculatedShipping);
        setTotalAmount(amount + calculatedShipping);
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
        total: initialAmount,
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
      <h1 className="text-2xl font-bold text-left">Your Cart</h1>

      <p className="text-lg text-muted-foreground">
        Review and manage the items in your cart.
      </p>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Card className="hidden md:block ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-center opacity-0">
                    Actions
                  </TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Your cart is empty.
                    </TableCell>
                  </TableRow>
                ) : (
                  cartItems?.map((item: EnhancedCartItemType) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-start">
                        <Suspense
                          fallback={
                            <Skeleton className="w-[50px] h-[75px]" />
                          }
                        >
                          <Image
                            src={
                              item.book.image_directory !== null
                                ? `${item.book.image_directory}image-1.png`
                                : "/placeholder.png"
                            }
                            alt={item.book.title}
                            width={50}
                            height={75}
                          />
                        </Suspense>
                      </TableCell>
                      <TableCell className="text-start">
                        {item.book.title}
                      </TableCell>
                      <TableCell className="text-start">
                        {item.book.author}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => router.push(`/books/${item.book.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-start">
                        ${item.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-right">
                    Shipping:
                  </TableCell>
                  <TableCell>${shippingCost.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-bold">
                    Total:
                  </TableCell>
                  <TableCell className="font-bold">
                    ${totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
          <div className="hidden md:flex justify-end items-center">
            <Button
              variant="default"
              onClick={handleCheckout}
              disabled={cartItems?.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>

          <div className="block md:hidden space-y-4">
            {cartItems?.length === 0 ? (
              <div className="text-center">Your cart is empty.</div>
            ) : (
              cartItems?.map((item: EnhancedCartItemType) => (
                <Card key={item.id} className="flex flex-col p-4">
                  <div className="flex items-center space-x-4">
                    <Suspense
                      fallback={<Skeleton className="w-[75px] h-[100px]" />}
                    >
                      <Image
                        src={`${item.book.image_directory}image-1.png`}
                        alt={item.book.title}
                        width={75}
                        height={100}
                      />
                    </Suspense>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">
                        {item.book.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {item.book.author}
                      </p>
                      <p className="text-sm font-bold mt-2">
                        Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/books/${item.book.id}`)}
                    >
                      <Eye className="h-4 w-4 " />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
            {cartItems && cartItems.length > 0 && (
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between">
                  <p>Subtotal:</p>
                  <p>${initialAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping:</p>
                  <p>${shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <p>Total:</p>
                  <p>${totalAmount.toFixed(2)}</p>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={handleCheckout}
                  disabled={cartItems?.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
