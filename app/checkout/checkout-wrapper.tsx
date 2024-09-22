"use client";

import { useState } from "react";
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
import { ShoppingCart, CreditCard, Truck } from "lucide-react";
import {
  LinkAuthenticationElement,
  CardElement,
  AddressElement,
  Elements,
} from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/checkout-form";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ""
);

export default function CheckoutWrapper({
  clientSecret,
  dpmCheckerLink,
  cartItems,
}: {
  clientSecret: string;
  dpmCheckerLink: string;
  cartItems: any;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  console.log("cartItems in wrapper", cartItems);

  // const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  // const tax = subtotal * 0.08 // Assuming 8% tax rate
  // const total = subtotal + tax

  return (
    <div className="container mx-auto p-6 space-y-8">
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
                    {cartItems?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.author}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  {/* <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Tax: ${tax.toFixed(2)}</p>
                <p className="font-bold">Total: ${total.toFixed(2)}</p> */}
                </div>
              </CardFooter>
            </Card>
          </div>

          <TabsContent value="cart">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.author}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))} */}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <span>Total:</span>
                  {/* <span className="font-bold">${total.toFixed(2)}</span> */}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="payment">
            <div>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret: clientSecret }}
              >
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
              </Elements>
            </div>
          </TabsContent>
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
                  <Elements stripe={stripePromise}>
                    <AddressElement
                      id="shipping-address"
                      options={{ mode: "shipping" }}
                    />
                  </Elements>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      <div className="flex justify-end">
        <Button>Place Order</Button>
      </div>
    </div>
  );
}
