"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

// Mock data for an order
const order = {
  id: '1',
  date: '2023-06-01',
  status: 'Delivered',
  total: 29.99,
  items: [
    { id: '1', title: 'The Great Gatsby', quantity: 1, price: 14.99, coverImg: '/placeholder.svg?height=150&width=100' },
    { id: '2', title: 'To Kill a Mockingbird', quantity: 1, price: 15.00, coverImg: '/placeholder.svg?height=150&width=100' },
  ],
  shippingAddress: '123 Book Lane, Reading, CA 90210',
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="container mx-auto w-full space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-primary">
            Order #{params.id}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Order Date: {order.date}</p>
            <p className="text-lg font-semibold">Total: ${order.total.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Status</h3>
            <p className="text-lg">{order.status}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Order Items</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 mb-4">
                <Image
                  src={item.coverImg}
                  alt={item.title}
                  width={100}
                  height={150}
                  className="rounded"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                  <p className="text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Shipping Address</h3>
            <p>{order.shippingAddress}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
