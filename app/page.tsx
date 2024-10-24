import { getFeaturedBooks } from "./actions/get-featured-books";
import BookDisplay from "@/app/books/components/book-display";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BgGlowContainer from "@/components/bg-glow-container";
import { getAllBooks } from "./actions/get-all-books";
import { Book } from "@/app/books/components/book";
import { BookType } from "@/lib/types/types";

const FeaturedBooks = ({ featuredBooks }: { featuredBooks: BookType[] }) => {
  return (
    <section className="space-y-6 container mx-auto ">
      <h2 className="text-xl font-semibold" id="featured">
        Featured
      </h2>

      <Separator />
      <p className="text-lg mb-6 text-muted-foreground">
        Handpicked by Kathrin.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {featuredBooks.map((book) => (
          <Book key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default async function HomePage() {
  const allBooks = await getAllBooks();
  const featuredBooks = await getFeaturedBooks();

  return (
    <div className="flex flex-col justify-center h-full gap-16 pt-6">
      <BgGlowContainer>
        <div className="flex flex-col gap-6 container mx-auto justify-between items-start text-left text-primary w-full ">
          <div className="text-4xl md:text-5xl font-extrabold text-left ">
            Find Your Next
            <br /> Great Read.
          </div>
          <p className="text-base md:text-xl md:max-w-[50%] ">
            Discover a curated selection of rare books. From classics to lifestyle
            books and modern novels,{" "}
            <span className="font-bold">Kathrin&apos;s Books</span> has something
            for every reader.
          </p>
          <Link href="/books">
            <Button className="flex items-center space-x-2 z-30 font-bold">
              Browse Books
              <ArrowRightIcon />
            </Button>
          </Link>
        </div>
      </BgGlowContainer>

      <FeaturedBooks featuredBooks={featuredBooks} />

      <section className="space-y-6 container mx-auto">
        <h2 className="text-xl font-semibold">Latest Books</h2>

        <Separator />
        <p className="text-lg mb-6 text-muted-foreground">Just listed.</p>
        <BookDisplay books={allBooks} />

        <Link
          href="/books"
          className="flex items-center justify-center py-6 md:py-12"
        >
          <Button className="flex items-center justify-center space-x-2">
            <span>View All Books</span>
            <ArrowRightIcon />
          </Button>
        </Link>
      </section>

      <section className="space-y-6 container mx-auto">
        <h2 className="text-xl font-semibold mb-2">About</h2>

        <Separator />

        <div className="flex gap-4 items-center">
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
          <Separator className="h-16" orientation="vertical" />
          <p className="font-medium text-muted-foreground">
            Kathrin's Books is an online bookstore curated by Kathrin, offering
            a wide range of books selected with love and care. Her mission is to
            connect readers with their next great read.
          </p>
        </div>
      </section>
    </div>
  );
}
