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
        <p className="text-gray-600">Author: {book.author}</p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">ISBN: {book.isbn}</p>
        <p className="text-gray-600">Price: ${book.price}</p>
        <p className="text-gray-600">Genre: {book.genre}</p>
      </CardContent>


    </Card>
  );
};
