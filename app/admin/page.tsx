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
import { EllipsisIcon, Pen, Trash } from "lucide-react";
import { fetchBooks } from "../actions/fetch-books";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteBook } from "../actions/delete-book";
import { Message } from "@/components/form-message";
import { DeleteBookForm } from "@/components/delete-book-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getProductByBookId } from "../actions/get-product";
import { createClient } from "@/utils/supabase/server";
import { getErrorRedirect } from "@/utils/helpers";
import {
  getOrdersWithOrderItems,
  getUserDataById,
} from "@/utils/supabase/queries";
import { encodedRedirect } from "@/utils/utils";

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

  const books = await fetchBooks();

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

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Sold</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 from last month</p>
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
      </div> */}

      <Tabs defaultValue="books" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
            <TabsTrigger value="books">Books</TabsTrigger>

            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <Link href="admin/add">
            <Button size={"sm"}>Add Book</Button>
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
                    <TableHead>User ID</TableHead>
                    <TableHead>Order Items</TableHead>
                    <TableHead>Order Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.user_id}</TableCell>
                        <TableCell>
                          {order.items.map((item: any) => (
                            <div key={item.id}>
                              <Link href={`/books/${item.book_id}`}>
                                {item.book_title}
                              </Link>{" "}

                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          {order.ordered_at
                            ? new Date(order.ordered_at).toLocaleString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No Orders
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="books" className="space-y-4 ">
          <Card>
            <CardHeader>
              <CardTitle>Books</CardTitle>
            </CardHeader>
            <CardContent className=" w-fit md:w-full overflow-hidden container ">
              <Table>
                <TableHeader>
                  <TableRow className="w-full">
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Author
                    </TableHead>
                    <TableHead>Price</TableHead>

                    <TableHead className="hidden md:table-cell min-w-[100px]">
                      Posted
                    </TableHead>
                    <TableHead className="">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <Link href={`/books/${book.id}`}>{book.title}</Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {book.author}
                      </TableCell>

                      <TableCell>${book.price?.toFixed(2)}</TableCell>

                      <TableCell className="hidden md:table-cell">
                        {format(new Date(book.created_at), "MMM dd, yyyy, hh:mm a")}
                      </TableCell>
                      <TableCell className="hidden md:flex space-x-4 items-center">
                        <Link href={`/admin/edit/${book.id}`}>
                         <Pen className="h-4 w-4" />
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger >
                            <Trash className="h-4 w-4   text-destructive" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this book.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <DeleteBookForm
                                deleteBook={deleteBook}
                                bookId={book.id}
                                getProductByBookId={getProductByBookId}
                                alertDialogAction={
                                  <AlertDialogAction
                                    type="submit"
                                    className="h-10 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                }
                              />
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                      <TableCell className="table-cell md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            {" "}
                            <EllipsisIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="flex flex-col gap-3 items-start p-4 text-sm">
                            <Link href={`/admin/edit/${book.id}`}>
                              <button>Edit</button>
                            </Link>

                            <Separator />
                            <Link href={`/books/${book.id}`}>
                              <button>View</button>
                            </Link>

                            <Separator />
                            <AlertDialog>
                              <AlertDialogTrigger className="text-destructive hover:text-destructive/90 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                Delete
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-xs">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this book.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <DeleteBookForm
                                    deleteBook={deleteBook}
                                    bookId={book.id}
                                    getProductByBookId={getProductByBookId}
                                    alertDialogAction={
                                      <AlertDialogAction
                                        type="submit"
                                        className="h-10 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    }
                                  />
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
