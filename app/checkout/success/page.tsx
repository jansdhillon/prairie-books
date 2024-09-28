// /app/checkout/success/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/utils/stripe/config";
import { getOrderById } from "@/app/actions/get-order-by-id";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    // If no session_id is provided, redirect to home or show an error
    return redirect("/");
  }

  // Retrieve the session from Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    return redirect("/");
  }

  // Get the order_id from the session metadata
  const orderId = session?.metadata?.order_id;


  if (!orderId) {
    console.error("No order_id found in session metadata");
    return redirect("/");
  }

  // Fetch the order details from Supabase
  const { data, error } = await getOrderById(orderId);

  if (error || !data) {
    console.error("Error fetching order details:", error);
    return redirect("/");
  }

  // Optionally, you can update the order status in the database here,
  // but it's better to handle this via Stripe webhooks for reliability.

  // Render the success page with the order details
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
      <p>Your order has been successfully processed.</p>

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
                {data.items.map((item: any) => (
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
                    <TableCell>
                      ${(item.price / 100).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
