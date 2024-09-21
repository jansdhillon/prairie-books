import { createClient } from "@/utils/supabase/server";
import BookDisplay from "@/components/book-display";
import { fetchBooks } from "./actions/fetch-books";
import { Separator } from "@/components/ui/separator";
import { getFeaturedBooks } from "./actions/get-featured-books";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowRightIcon } from "lucide-react";

export default async function HomePage() {
  const books = await fetchBooks();
  const featuredBooks = await getFeaturedBooks();

  const sortedBooks = books.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });


  return (
    <div className="flex flex-1  flex-col space-y-6 ">
      <h1 className="text-5xl font-bold  text-left">Find your next read.</h1>
      <p className="text-lg text-left"></p>

      {/*Featured*/}
      <h2 className="text-2xl font-bold text-left" id="featured">Featured</h2>
      <Separator />
      <p className="text-lg text-left text-muted-foreground">
        Handpicked weekly by Kathrin.
      </p>

      <BookDisplay books={featuredBooks || []} />

      <h2 className="text-2xl font-bold text-left pt-12">All Books</h2>
      <Separator />

      <Link href="/books">
        <Button variant={"outline"} className="space-x-2">
          {" "}
          <div>Explore Kathrin's entire store </div>
          <ArrowRightIcon />
        </Button>
      </Link>


      <h2 className="text-2xl font-bold text-left pt-12" id="about">About</h2>
      <Separator />
      <div className="flex gap-10 items-center ">
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
