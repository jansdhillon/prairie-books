import { createClient } from "@/utils/supabase/server";
import BookDisplay from "@/components/book-display";
import { fetchBooks } from "./actions/fetch-books";
import { Separator } from "@/components/ui/separator";


export default async function HomePage() {

  const books = await fetchBooks();




  return (
    <div className="flex flex-1  flex-col space-y-6 ">
      <h1 className="text-5xl font-bold  text-left">
        Find your next read.
      </h1>
      <Separator/>
      {/*Featured*/}
      <h2 className="text-2xl font-bold text-left">Featured</h2>
      <BookDisplay books={books || []} />
      <Separator/>
      <h2 className="text-2xl font-bold text-left">New</h2>
      <BookDisplay books={books || []} />
      <Separator/>
      <h2 className="text-2xl font-bold text-left">All Books</h2>
      <BookDisplay books={books || []} />
    </div>
  );
}
