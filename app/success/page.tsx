"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "../loading";
import { postData } from "@/utils/helpers";
import Image from "next/image";

export default function SuccessPage() {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams?.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await postData({
          url: "/api/get-order-details",
          data: { session_id: sessionId },
        });

        setOrder(res?.orderWithItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
      <p>Your order has been successfully processed.</p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          {!isLoading ? (
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author (s) </TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.map((item: any) => (
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
            </CardContent>
          ) : (
            <Loading />
          )}
        </Card>
      </div>
    </div>
  );
}
