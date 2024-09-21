import { fetchBooks } from "../actions/fetch-books"
import BookDisplay from "@/components/book-display"
import { Separator } from "@/components/ui/separator"

export default async function AllBooksPage() {
  const books = await fetchBooks()

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-3xl font-bold text-left">All Books</h1>
      <Separator />

      <p className="text-lg text-muted-foreground">
        Explore the entire collection of books.
      </p>

      {books.length > 0 ? (
        <BookDisplay books={books} />
      ) : (
        <p className="text-lg text-muted-foreground">No books available at the moment.</p>
      )}
    </div>
  )
}
