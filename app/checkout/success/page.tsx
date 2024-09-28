import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
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

export default async function SuccessPage({ searchParams }: { searchParams: { order_id?: string } }) {
  const orderId = searchParams.order_id;

  if (!orderId) {
    return redirect("/");
  }


  const { data, error } = await getOrderById(orderId);

  if (error || !data) {
    console.error("Error fetching order details:", error);
    return redirect("/");
  }


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
