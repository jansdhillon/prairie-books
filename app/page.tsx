import { fetchBooks } from "./actions/fetch-books";
import { getFeaturedBooks } from "./actions/get-featured-books";
import BookDisplay from "@/components/book-display";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BgGlowContainer from "@/components/bg-glow-container";

export default async function HomePage() {
  const books = await fetchBooks();
  const featuredBooks = await getFeaturedBooks();

  const sortedBooks = books.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex flex-col justify-center gap-16 py-16 ">
      <BgGlowContainer>
        <div className=" flex flex-col gap-6 justify-center items-center text-center md:px-12 text-primary ">
          <div className="text-5xl md:text-6xl font-black text-center ">
            Find Your Next<br/> Great Read
          </div>
          <p className="text-lg md:text-2xl   md:px-12">
            Discover a curated selection of rare books. From classics to
            lifestyle books and modern novels,{" "}
            <span className="font-bold">Kathrin&apos;s Books</span> has
            something for every reader.
          </p>
          <Link href="/books">
            <Button
              size={"lg"}
              className="flex items-center space-x-2 z-30 font-bold"
            >
              Browse Books
              <ArrowRightIcon />
            </Button>
          </Link>
        </div>
      </BgGlowContainer>


      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Latest Books</h2>

        <Separator />
        <p className="text-lg mb-6 text-muted-foreground">Just listed.</p>
        <BookDisplay books={sortedBooks} />

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
      <section className="space-y-6">
        <h2 className="text-xl font-semibold" id="featured">
          Featured
        </h2>

        <Separator />
        <p className="text-lg mb-6 text-muted-foreground">
          Handpicked by Kathrin.
        </p>

        <BookDisplay books={featuredBooks} />
      </section>
      {/* <section className="space-y-6">
        <h2 className="text-2xl font-semibold mb-2">What Readers Are Saying</h2>

        <Separator />
        <div className="p-4 space-y-4">
          <p>⭐️ ⭐️ ⭐️ ⭐️ ⭐️</p>
          <p className="italic font-medium">
            "An amazing selection of books! I can always count on Kathrin to
            find rare and unique books."
          </p>
          <p className="mt-2 text-right ">- Griffin Sherwood</p>
        </div>
        <div className="p-4 space-y-4">
          <p>⭐️ ⭐️ ⭐️ ⭐️ ⭐️</p>
          <p className="italic font-medium">
            "Kathrin's Books has become my go-to place for books, much better
            than Facebook Marketplace!"
          </p>
          <p className="mt-2 text-right ">- B. Bean</p>
        </div>
      </section> */}
      <section className="space-y-6">
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
