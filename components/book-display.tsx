import { Database } from "@/utils/database.types";
import { Book } from "./book";

export type BookType = Database["public"]["Tables"]["books"]["Row"];

type BookDisplayProps = {
  books: BookType[];
};

const BookDisplay = ({ books }: BookDisplayProps) => {
  if (books.length === 0) {
    return <p className="text-center">No books available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book: BookType) => (
        <Book key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookDisplay;
