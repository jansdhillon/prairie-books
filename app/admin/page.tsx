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
import { ClientWrapper as BookClientWrapper } from "./components/books/client-wrapper";
import { ClientWrapper as OrderClientWrapper } from "./components/orders/client-wrapper";
import { DataTable } from "@/app/orders/components/data-table";
import { orderColumns } from "@/app/orders/components/order-columns";

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
          <OrderClientWrapper data={orders} />
        </TabsContent>
        <TabsContent value="books" className="space-y-4 ">
          <BookClientWrapper data={books} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
