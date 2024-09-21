import { fetchBooks } from "../actions/fetch-books"
import BookDisplay from "@/components/book-display"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string }
}) {
  const query = searchParams.query || ""
  const books = await fetchBooks()

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-3xl font-bold text-left">Search Results</h1>
      <Separator />

      <form className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search books..."
          name="query"
          defaultValue={query}
        />
        <Button type="submit">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
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
