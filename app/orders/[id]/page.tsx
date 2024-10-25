import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getOrderAction } from "@/app/actions/get-order-by-id";
import Link from "next/link";
import { orderItemColumns } from "@/app/orders/components/order-items-columns";
import { DataTable } from "./data-table";


export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = params.id;

  if (!orderId) {
    return redirect("/");
  }

  const { order, orderItems, error } = await getOrderAction(orderId);

  if (error || !order || !orderItems) {
    console.error("Error fetching order details:", error);
    return redirect("/");
  }

  const getOrderStatusMessage = (status: string | null) => {
    switch (status) {
      case "Delivered":
        return "Your order has been delivered! We hope you enjoy your purchase.";
      case "Shipped":
        return "Your order is on its way! You will receive it soon.";
      case "Ordered":
        return "Your order has been placed successfully! It will be shipped soon.";
      case "Failed":
        return "There was an issue with your order. Please contact support.";
      case "Pending":
        return "Your order is being processed. Thank you for your patience!";
      default:
        return "Unknown order status. Please contact support for more information.";
    }
  };

  const statusMessage = getOrderStatusMessage(order?.status);

  return (
    <div className="container mx-auto w-full space-y-6">
      <div>
        <Link href="/orders">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <div className="text-sm space-y-4 pt-4">
              <p>
                <span className="font-semibold">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-semibold">Order Date:</span>{" "}
                {new Date(order.ordered_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
              <p className="text-base">{statusMessage}</p>
            </div>
          </CardHeader>

          <CardContent>
            <DataTable columns={orderItemColumns} data={orderItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
