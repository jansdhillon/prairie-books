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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BookOpen, DollarSign, ShoppingCart, Users } from "lucide-react";
import { Book } from "@/components/book";
import { fetchBooks } from "../actions/fetch-books";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/get-user";
import { Database } from "@/utils/database.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getOrdersByUserId } from "../actions/get-orders";
import { deleteBook } from "../actions/delete-book";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];



export default async function AdminDashboard() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  console.log(user);

  const { userData } = await getUser(user.id);

  console.log(userData);

  if (userData.is_admin !== true) {
    return redirect("/");
  }

  const books = await fetchBooks();

  const orders = await getOrdersByUserId(user.id);

  const handleSubmit = async (bookId: string, e: any) => {
    e.preventDefault();
    console.log("delete book");
    await deleteBook(bookId);
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Welcome, Kathrin!</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Sold</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="books" className="space-y-4">
        <div className="flex justify-between">
          <TabsList>
            {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
            <TabsTrigger value="books">Books</TabsTrigger>

            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <Link href="admin/add">
            <Button>Add Book</Button>
          </Link>
        </div>
        {/* <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]"> */}
              {/* <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer> */}
            {/* </CardContent>
          </Card>
        </TabsContent> */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.user?.name}</TableCell>
                      <TableCell>
                        ${order.payment?.amount?.toFixed(2)}
                      </TableCell>
                      <TableCell>{order.payment?.status}</TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align={"center"}>
                        No Orders
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="books" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Books</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Edition</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>
                        ${book.price?.toFixed(2)}
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.edition}</TableCell>
                      <TableCell>
                       <form onSubmit={(e) => handleSubmit(book.id, e)}>
                          <Button variant={"outline"} size={"sm"} type="submit">
                            Remove
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                  {books.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align={"center"}>
                        No Books Listed Yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
