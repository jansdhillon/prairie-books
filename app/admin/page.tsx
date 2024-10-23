import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllBooks } from "../actions/get-all-books";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { getErrorRedirect } from "@/utils/helpers";
import {
  getOrdersWithOrderItems,
  getUserDataById,
} from "@/utils/supabase/queries";
import { encodedRedirect } from "@/utils/utils";
import { ClientWrapper } from "./components/client-wrapper";

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be signed in to view this page"
    );
  }

  const { data: userData } = await getUserDataById(supabase, user?.user!.id);
  if (userData.is_admin !== true) {
    return encodedRedirect(
      "error",
      "/",
      "You must be an admin to view this page"
    );
  }

  const books = await getAllBooks();

  const { data: orders, error } = await getOrdersWithOrderItems(
    supabase,
    userData.id
  );

  if (error) {
    console.error("Error fetching orders:", error.message);
    redirect(
      getErrorRedirect("/admin", "Error fetching orders", error.message)
    );
  }

  return (
    <div className="space-y-8 px-0">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Tabs defaultValue="books" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="books">Books</TabsTrigger>

            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Books Ordered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          {order.items.map((item: any) => (
                            <div key={item.id}>
                              <Link href={`/books/${item.book_id}`}>
                                {item.book_title}
                              </Link>
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>{order.status || "Pending"}</TableCell>
                        <TableCell>
                          $
                          {order.items_total + order.shipping_cost ||
                            order.items
                              .reduce(
                                (total: number, item: any) =>
                                  total + item.price * item.quantity,
                                0
                              )
                              .toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {order.ordered_at
                            ? format(
                                new Date(order.ordered_at),
                                "MMM dd, yyyy, hh:mm a"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No Orders Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="books" className="space-y-4 ">
          <ClientWrapper data={books} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
