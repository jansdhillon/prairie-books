import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getOrderById } from "@/app/actions/get-order-by-id";
import Link from "next/link";
import { getOrderItemsByOrderId } from "@/app/actions/get-order-items-by-order-id";

import { Badge } from "@/components/ui/badge";
import { convertStatus } from "../convert-status";
import { format } from "date-fns";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id);

  return (
    <div className="container mx-auto w-full space-y-8">
      <div>
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-primary">
            Order #{order.id}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Order Date:  {format(new Date(order.ordered_at), "yyyy-MM-dd")}
            </p>
            <p className="text-lg font-semibold">
              Total: ${order.payment?.amount?.toFixed(2)} CAD
            </p>
          </div>

          <div className="inline-flex items-stretch space-x-3  ">
            <h3 className="text-xl font-semibold text-primary">Status:</h3>
            <Badge>{convertStatus(order?.payment?.status)}</Badge>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">
              Order Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Image
                    priority
                    src={
                      item.book?.image_directory
                        ? `${item.book.image_directory}image-1.png`
                        : "/placeholder.png"
                    }
                    alt={item.book?.title}
                    height={100}
                    width={75}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="text-lg font-semibold">{item.book?.title}</p>
                    <p className="text-muted-foreground">
                      {item.quantity} x ${item.book?.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-2 text-primary">
              Shipping Address
            </h3>
            <p>{order?.shippingAddress}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
