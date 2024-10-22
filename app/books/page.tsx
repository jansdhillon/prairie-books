
import { BookPage } from "@/components/book-page";
import { getAllBooks } from "../actions/get-all-books";

export default async function AllBooksPage() {
  const allBooks = await getAllBooks();
  return (
    <BookPage
      books={allBooks}
      title="All Books"
      subtitle="Explore the entire collection of books."
    />
  );
}
