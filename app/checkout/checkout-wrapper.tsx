"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Truck } from "lucide-react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  BookType,
  CartItemType,
  EnhancedCartItemType,
  OrderItemType,
  ProductType,
} from "@/lib/types/types";

interface Book {
  title: string;
  author: string;
}

interface ShippingAddress {
  name: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    country: string;
    postal_code: string;
    state: string;
  };
}

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  description: string;
  eligibility?: (orderTotal: number, address: any) => boolean;
}

export default function CheckoutWrapper({
  paymentIntentId,
  cartItems,
  completeCheckoutAction,
  cancelCheckoutAction,
}: {
  paymentIntentId: string;
  cartItems: EnhancedCartItemType[];
  completeCheckoutAction: (
    cartItems: EnhancedCartItemType[],
    paymentIntentId: string,
    finalAmount: number
  ) => Promise<any>;
  cancelCheckoutAction: (paymentIntentId: string) => Promise<any>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isAddressReady, setIsAddressReady] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("Cancelling checkout...");
      cancelCheckoutAction(paymentIntentId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [paymentIntentId, cancelCheckoutAction]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setOrderTotal(total);
    console.log("Order Total: ", total);
  }, [cartItems]);

  const allShippingOptions: ShippingOption[] = [
    {
      id: "standard",
      name: "Standard Shipping ($15)",
      cost: 15,
      description: "Delivery in 3-5 business days via Canada Post.",
    },
    {
      id: "free",
      name: "Free Shipping",
      cost: 0,
      description: "Eligible for orders over $75 before taxes.",
      eligibility: (total) => total >= 75,
    },
    {
      id: "local",
      name: "Local Delivery (Calgary)",
      cost: 0,
      description:
        "Free delivery within Calgary. Delivery in 1-2 business days.",
      eligibility: (total, shippingAddress) =>
        shippingAddress &&
        shippingAddress.address.city.toLowerCase() === "calgary",
    },
  ];

  useEffect(() => {
    if (shippingAddress && isAddressReady && elements) {
      const eligibleOptions = allShippingOptions.filter((option) => {
        if (option.eligibility) {
          return option.eligibility(orderTotal, shippingAddress);
        }
        return true;
      });
      setShippingOptions(eligibleOptions);
      setSelectedShipping(eligibleOptions[0] || null);
    }
  }, [isAddressReady, orderTotal, elements, shippingAddress]);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    if (!selectedShipping) {
      return;
    }

    console.log("Selected shipping:", selectedShipping);
    console.log("Order total:", orderTotal);




    const totalAmount = orderTotal + selectedShipping.cost;

    console.log("Total amount:", totalAmount);



    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems,
        successUrl: window.location.origin + "/checkout/success",
      }),
    });

    const { sessionId } = await response.json();

    if (!sessionId) {
      setIsProcessing(false);
      console.error("Failed to create session");
      return;
    }

    const { error } = await stripe?.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Stripe Checkout error:", error.message);
      setIsProcessing(false);
    }
  };


  const handleAddressElementChange = (event: any) => {
    setIsAddressReady(event.complete);
    if (event.value) {
      setShippingAddress(event.value);
    }
  };

  const handlePaymentElementChange = (event: any) => {
    setIsPaymentReady(event.complete);
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.value.email);
  };

  return (
    <form
      onSubmit={handlePlaceOrder}
      className="flex flex-1 flex-col space-y-6"
    >
      <Tabs defaultValue="shipping" className="space-y-4">
        <div className="flex flex-col gap-3 md:gap-0 md:flex-row items-start md:items-center justify-between">
          <h1 className="text-3xl font-bold text-left">Checkout</h1>
          <TabsList>
            <TabsTrigger value="shipping">
              <Truck className="h-4 w-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {item.book?.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.book?.author}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {selectedShipping && (
                      <TableRow>
                        <TableCell className="font-semibold">
                          Shipping
                        </TableCell>
                        <TableCell>
                          ${selectedShipping.cost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-semibold">Total</TableCell>
                      <TableCell>
                        $
                        {(
                          cartItems.reduce(
                            (acc, item) => acc + item.price * item.quantity,
                            0
                          ) + (selectedShipping?.cost || 0)
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {shippingOptions.length > 0 && (
                  <Table className="w-full">
                    <TableBody>
                      {shippingOptions.map((option) => (
                        <TableRow key={option.id}>
                          <TableCell>
                            <div>
                              <input
                                type="radio"
                                id={option.id}
                                name="shipping"
                                value={option.id}
                                checked={selectedShipping?.id === option.id}
                                onChange={() => setSelectedShipping(option)}
                                className="mr-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <label
                              htmlFor={option.id}
                              className="flex flex-col"
                            >
                              <span className="">{option.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {option.description}
                              </span>
                            </label>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <TabsContent value="shipping" className="p-0 m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping-address">Shipping Address</Label>
                    <AddressElement
                      id="shipping-address"
                      options={{ mode: "shipping" }}
                      onChange={handleAddressElementChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="p-0 m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <LinkAuthenticationElement
                      id="link-authentication-element"
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <PaymentElement
                      id="payment-element"
                      options={{ layout: "tabs" }}
                      onChange={handlePaymentElementChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            isProcessing ||
            !stripe ||
            !elements ||
            !email ||
            !isPaymentReady ||
            !isAddressReady ||
            !selectedShipping
          }
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
