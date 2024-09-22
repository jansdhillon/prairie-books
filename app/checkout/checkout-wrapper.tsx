"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  LinkAuthenticationElement,
  CardElement,
  AddressElement,
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/checkout-form";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutWrapper({
  clientSecret,
  dpmCheckerLink,
  orderItems,
  payment,
}: {
  clientSecret: string;
  dpmCheckerLink: string;
  orderItems: any;
  payment: any;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    orderItems.map((item: any) => {
      console.log("item", item);
    });

    console.log(payment);

    setIsLoading(false);
  };


  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you are ready.');
    }
  }, []);

  console.log("orderItems in wrapper", orderItems);
  console.log("payment in wrapper", payment);


  return (
    <form className="container mx-auto p-6 space-y-8" onSubmit={handleSubmit}>
      <Tabs defaultValue="shipping" className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <TabsList>
            <TabsTrigger value="payment">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="shipping">
              <Truck className="h-4 w-4 mr-2" />
              Shipping
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
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item: any) => (
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
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  {/* You can add subtotal, tax, and total calculations here */}
                </div>
              </CardFooter>
            </Card>
          </div>

          <TabsContent value="payment">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <LinkAuthenticationElement id="email" />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="card-element"
                      className="text-sm font-medium"
                    >
                      Card Details
                    </label>
                    <CardElement id="card-element" />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="address-element"
                      className="text-sm font-medium"
                    >
                      Billing Address
                    </label>
                    <AddressElement
                      id="address-element"
                      options={{ mode: "billing" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={{ layout: "tabs" }}  />
            <button disabled={isLoading || !stripe || !elements} id="submit">
              <span id="button-text">
                {isLoading ? (
                  <div className="spinner" id="spinner"></div>
                ) : (
                  "Pay now"
                )}
              </span>
            </button>

            {message && <div id="payment-message">{message}</div>}
          </form> */}

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="shipping-address"
                    className="text-sm font-medium"
                  >
                    Shipping Address
                  </label>

                  <AddressElement
                    id="shipping-address"
                    options={{ mode: "shipping" }}
                    className="text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      <div className="flex justify-end">
        <Button type="submit">Place Order</Button>
      </div>
    </form>
  );
}
