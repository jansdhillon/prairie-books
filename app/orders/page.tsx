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
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { getOrdersWithOrderItems } from "@/utils/supabase/queries";
import { getUserDataAction } from "../actions/get-user";

export default async function OrdersPage() {
  const supabase = createClient();

  const { data: userData, error: authError } = await getUserDataAction();
  if (authError) {
    redirect("/sign-in");
  }

  const { data: orders, error } = await getOrdersWithOrderItems(
    supabase,
    userData.id
  );

  if (error) {
    console.error("Error fetching orders:", error.message);
  }


  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-2xl font-bold text-left">Your Orders</h1>
      <Separator />

      <p className="text-lg text-muted-foreground">
        View and track your book orders.
      </p>

      <div className="rounded-xl">
        <Table className="border-2">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Ordered On</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {order.ordered_at
                    ? format(new Date(order.ordered_at), "yyyy-MM-dd")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item: any) => (
                      <div key={item.id}>
                        {item?.book_title}
                      </div>
                    ))
                  ) : (
                    <div>No items</div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-xs text-center mx-auto line-clamp-1"
                    variant={"default"}
                  >
                    {order.status}
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
      </div>

      {orders?.length === 0 && (
        <p className="text-center text-muted-foreground">
          You haven't placed any orders yet.
        </p>
      )}
    </div>
  );
}
