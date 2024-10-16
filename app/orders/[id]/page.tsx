import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getOrderAction } from "@/app/actions/get-order-by-id";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { OrderItemType } from "@/lib/types/types";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = params.id;

  if (!orderId) {
    return redirect("/");
  }


  const { data, error } = await getOrderAction(orderId);

  if (error || !data) {
    console.error("Error fetching order details:", error);
    return redirect("/");
  }

  return (
    <div className="container mx-auto w-full space-y-8">
      <div>
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>
      </div>

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
                    <TableHead>Title</TableHead>
                    <TableHead>Author (s) </TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((item: any) => (
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
        </Card>
      </div>
    </div>
  );
}
