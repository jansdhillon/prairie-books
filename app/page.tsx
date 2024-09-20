import { createClient } from "@/utils/supabase/server";
import BookDisplay from "@/components/book-display";
import { fetchBooks } from "./actions/fetch-books";
import { Separator } from "@/components/ui/separator";
import { getFeaturedBooks } from "./actions/get-featured-books";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HomePage() {
  const books = await fetchBooks();
  const featuredBooks = await getFeaturedBooks();

  const sortedBooks = books.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  console.log(sortedBooks);

  return (
    <div className="flex flex-1  flex-col space-y-6 ">
      <h1 className="text-5xl font-bold  text-left">Find your next read.</h1>
      <p className="text-lg text-left"></p>

      {/*Featured*/}
      <h2 className="text-2xl font-bold text-left">Featured</h2>
      <Separator />
      <p className="text-lg text-left text-muted-foreground">
        Handpicked weekly by Kathrin.
      </p>

      <BookDisplay books={featuredBooks || []} />

      <h2 className="text-2xl font-bold text-left ">New</h2>
      <Separator />
      <p className="text-base text-left text-muted-foreground">
        The latest books added to the collection.
      </p>

      <BookDisplay books={sortedBooks || []} />

      <h2 className="text-2xl font-bold text-left ">All Books</h2>
      <Separator />
      <p className="text-base text-left text-muted-foreground">
        Explore Kathrin's entire store.
      </p>

      <BookDisplay books={books || []} />
      <h2 className="text-2xl font-bold text-left ">About</h2>
      <Separator />
      <div className="flex gap-10 items-center">
        <Avatar>
          <AvatarImage
            src="/kathrin.png"
            alt="Kathrin Dhillon"
            width={50}
        height={50}
            className=" rounded-full"
          />
          <AvatarFallback>KD</AvatarFallback>
        </Avatar>

        <p>
          Kathrin's Books is an online bookstore that offers a wide range of
          books, curated by Kathrin Dhillon.
        </p>
      </div>
    </div>
  );
}
