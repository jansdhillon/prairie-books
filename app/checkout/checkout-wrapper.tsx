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
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else {
      // Payment succeeded, redirect to success page
      router.push(`/checkout/success?order_id=${orderId}`);
    }
  };

  return (
    <form
      onSubmit={handlePlaceOrder}
      className="container mx-auto p-6 space-y-8"
    >
      <Tabs defaultValue="shipping" className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Checkout</h1>
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
          {/* Order Summary */}
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
                      <TableHead>Quantity</TableHead>
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
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${(item.price / 100).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

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
                    onChange={(event) => {
                      setEmail(event.value.email);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <PaymentElement
                    id="payment-element"
                    options={{ layout: "tabs" }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {message && <div id="payment-message">{message}</div>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isProcessing || !stripe || !elements}>
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
