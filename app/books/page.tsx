import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 9.99,
    image: "/placeholder.png?height=200&width=150&",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 12.99,
    image: "/placeholder.png?height=200&width=150",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    price: 10.99,
    image: "/placeholder.png?height=200&width=150",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 8.99,
    image: "/placeholder.png?height=200&width=150",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 11.99,
    image: "/placeholder.png?height=200&width=150",
  },
  {
    id: 6,
    title: "Moby-Dick",
    author: "Herman Melville",
    price: 13.99,
    image: "/placeholder.png?height=200",
  },
];

export default function BookStore() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
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
  );
}
