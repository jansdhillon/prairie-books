import { Suspense } from "react";
import { getAllBooks } from "../actions/get-all-books";
import { BookPage } from "../books/components/book-page";
import Loading from "../loading";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; message?: string };
}) {
  const query = searchParams.query || "";

  const allBooks = await getAllBooks();
  return (

      <BookPage
        books={allBooks}
        title="Search Results"
        subtitle={query ? `Showing results for "${query}"` : "Showing all books"}
        query={query}
      />
  );
}
