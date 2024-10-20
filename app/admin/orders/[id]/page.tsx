"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getOrderAction } from "@/app/actions/get-order-by-id"; // Adapt this for client-side fetching
import Loading from "@/app/loading";
// import { updateOrderStatus } from "@/app/actions/update-order-status"; // Adapt this for client-side action

export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = params.id;
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const { order, orderItems, error } = await getOrderAction(orderId);
        if (error) {
          setError(error.message);
          return;
        }
        setOrder(order);
        setOrderItems(orderItems);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getOrderStatusMessage = (status: string | null) => {
    switch (status) {
      case "Delivered":
        return "Order has been delivered.";
      case "Shipped":
        return "Order is in transit.";
      case "Ordered":
        return "Order has been placed successfully and is ready for processing.";
      case "Failed":
        return "There was an issue with this order. Please review the details.";
      case "Pending":
        return "Order is being processed.";
      default:
        return "Unknown order status. Please investigate.";
    }
  };

  const handleUpdateOrderStatus = async (newStatus: string) => {
    // try {
    //   await updateOrderStatus(order.id, newStatus);
    //   router.refresh(); // Refresh the page to reflect the status change
    // } catch (error) {
    //   console.error("Error updating order status:", error);
    // }
    console.log("Updating order status to:", newStatus);
  };

  if (isLoading) {
    return (<Loading/>);
  }



  const statusMessage = getOrderStatusMessage(order?.status);

  return (
    <div className="container mx-auto w-full space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <div className="text-sm space-y-4 pt-4">
              <p><span className="font-semibold">Order ID:</span> {order.id}</p>
              <p><span className="font-semibold">Order Date:</span> {new Date(order.ordered_at).toLocaleDateString()}</p>
              <p ><span className="font-semibold">Status:</span> {order.status}</p>
              <p className="text-base">{statusMessage}</p>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author(s)</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item?.image_directory && (
                        <Image
                          src={`${item?.image_directory}image-1.png`}
                          alt={item.book_title}
                          width={50}
                          height={50}
                        />
                      )}
                    </TableCell>
                    <TableCell>{item?.book_title}</TableCell>
                    <TableCell>{item?.book_author}</TableCell>
                    <TableCell>${item?.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-4" />

            {/* Admin Actions */}
            <div className="space-y-4">
              <h4 className="font-semibold">Manage Order Status</h4>
              <div className="flex space-x-4">
                <Button onClick={() => handleUpdateOrderStatus("Shipped")} variant="outline">
                  Mark as Shipped
                </Button>
                <Button onClick={() => handleUpdateOrderStatus("Delivered")} variant="outline">
                  Mark as Delivered
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Cancel Order</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this order? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Go Back</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleUpdateOrderStatus("Cancelled")}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
