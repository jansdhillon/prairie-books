import { BookType } from "@/types/book";
import { Card, CardContent, CardHeader } from "./ui/card";

type BookProps = {
  book: BookType;
};

export const Book = ({ book }: BookProps) => {
  return (
    <Card>
      <CardHeader>
        <img src={book.cover_image_url || ""} alt={book.title} className="h-48 w-full object-cover" />
        <h2 className="text-xl font-semibold">{book.title}</h2>
        <p >Author: {book.author}</p>
      </CardHeader>
      <CardContent>
        <p >ISBN: {book.isbn}</p>
        <p >Price: ${book.price}</p>
        <p >Genre: {book.genre}</p>
      </CardContent>


    </Card>
  );
};
