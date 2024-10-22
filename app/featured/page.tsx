import { BookPage } from "@/components/book-page";
import { getFeaturedBooks } from "../actions/get-featured-books";

export default async function AllBooksPage() {
  const featuredBooks = await getFeaturedBooks();
  return (
    <BookPage
      books={featuredBooks}
      title="Featured Books"
      subtitle="Handpicked by Kathrin."
    />
  );
}
