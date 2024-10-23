import { getAllBooks } from "../actions/get-all-books"
import BookDisplay from "@/app/books/components/book-display"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage } from "@/components/form-message"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string, message?: string }
}) {
  const query = searchParams.query || ""
  const books = await getAllBooks()

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase()) || book.description?.toLowerCase().includes(query.toLowerCase()) || book.genre?.some((genre: string) => genre?.toLowerCase().includes(query.toLowerCase())) || book.publisher?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-2xl font-bold text-left">Search Results</h1>
      <Separator />

      <form className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search books..."
          name="query"
          defaultValue={query}
        />
        <SubmitButton type="submit" pendingText="Searching...">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </SubmitButton>

      </form>

      {query && (
        <p className="text-lg text-muted-foreground">
          Showing results for: &quot;{query}&quot;
        </p>
      )}

      {filteredBooks.length > 0 ? (
        <BookDisplay books={filteredBooks} />
      ) : (
        <p className="text-lg text-muted-foreground">No books found.</p>
      )}
    </div>
  )
}
