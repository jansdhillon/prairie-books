import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrdersByUserId } from "../actions/get-orders";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getOrderItemsByOrderId } from "../actions/get-order-items-by-order-id";
import { format, set, sub } from "date-fns";
import { convertStatus } from "./convert-status";



export default async function OrdersPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const ordersWithItemsAndPayment = await getOrdersByUserId(user.id);

  console.log(ordersWithItemsAndPayment);

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-3xl font-bold text-left">Your Orders</h1>
      <Separator />

      <p className="text-lg text-muted-foreground">
        View and track your book orders.
      </p>

      <Table className="border-2 rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersWithItemsAndPayment.map((order: any) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {format(new Date(order.ordered_at), "yyyy-MM-dd")}
              </TableCell>
              <TableCell>
                {order.items.map((item: any) => (
                  <div key={item.id}>
                    {item.quantity} x {item.book?.title}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <Badge className="text-xs text-center mx-auto line-clamp-1 " variant={"default"}>
                  {convertStatus(order.payment.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Link href={`/orders/${order.id}`}>
                  <Button variant={"outline"} size={"sm"}>
                    <div className="text-xs">View Order</div>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {ordersWithItemsAndPayment.length === 0 && (
        <p className="text-center text-muted-foreground">
          You haven't placed any orders yet.
        </p>
      )}
    </div>
  );
}
