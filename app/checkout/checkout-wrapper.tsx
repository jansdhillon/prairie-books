"use client";

import { useState } from "react";
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

interface Book {
  title: string;
  author: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  book: Book;
}

interface CheckoutWrapperProps {
  clientSecret: string;
  orderItems: OrderItem[];
  orderId: string;
}

export default function CheckoutWrapper({
  clientSecret,
  orderItems,
  orderId,
}: CheckoutWrapperProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isAddressReady, setIsAddressReady] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      const errorMessage = error.message || "An unexpected error occurred.";
      const redirectUrl = `/checkout?status=error&title=Payment%20Error&message=${encodeURIComponent(
        errorMessage
      )}`;
      router.push(redirectUrl);
    } else {
      router.push(`/checkout/success?order_id=${orderId}`);
    }
  };

  const handleAddressElementChange = (event: any) => {
    setIsAddressReady(event.complete);
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
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.book.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.book.author}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${(item.price / 100).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
            !isAddressReady
          }
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
