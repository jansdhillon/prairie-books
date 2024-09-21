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

// Mock data for orders
const orders = [
  {
    id: "1",
    date: "2023-06-01",
    title: "The Great Gatsby",
    quantity: 1,
    status: "Delivered",
  },
  {
    id: "2",
    date: "2023-06-15",
    title: "To Kill a Mockingbird",
    quantity: 2,
    status: "Shipped",
  },
  {
    id: "3",
    date: "2023-06-30",
    title: "1984",
    quantity: 1,
    status: "Processing",
  },
];

export default function OrdersPage() {
  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-3xl font-bold text-left">Your Orders</h1>
      <Separator />

      <p className="text-lg text-muted-foreground">
        View and track your book orders.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Book Title</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.title}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "Delivered"
                      ? "default"
                      : order.status === "Shipped"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <Link
                href={`/orders/${order.id}`}
              >
                <Button variant={"default"} size={"sm"}>View Order</Button>
              </Link>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {orders.length === 0 && (
        <p className="text-center text-muted-foreground">
          You haven't placed any orders yet.
        </p>
      )}
    </div>
  );
}
