import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: books, error } = await supabase.from("books").select("*");


  try{
    const res = await fetch("http://localhost:3000/api/send", {method: "POST"});
    console.log(res);

  } catch (error) {
    console.error(error);
  }





  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <Button onClick={addBook}>
          Create Book
        </Button> */}
      {books?.map((book) => (
        <Card key={book.id}>
          <CardHeader>
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded-md "
            />
          </CardHeader>
          <CardContent>
            <CardTitle>{book.title}</CardTitle>
            <p className="text-muted-foreground">{book.author}</p>
            <p className="font-bold mt-2">${book.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add to Cart</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    </div>
  );
}
