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

export default async function HomePage() {
  const books = await fetchBooks();
  const featuredBooks = await getFeaturedBooks();

  const sortedBooks = books.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <>
      <div className="space-y-12">
        <section className="flex flex-col-reverse md:flex-row gap-12 items-center justify-between space-y-6 md:space-y-0 md:mb-20 ">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-bold mb-4">
              Find Your Next Page-Turner
            </h1>
            <p className="text-lg  mb-6 ">
              Discover a curated selection of rare books. From classics to
              lifestyle books and modern novels,{" "}
              <span className="font-bold">Kathrin&apos;s Books</span> has
              something for every reader.
            </p>
            <Link href="/books">
              <Button
                variant={"default"}
                className="flex items-center space-x-2"
              >
                <span>Browse Books</span>
                <ArrowRightIcon />
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 ">
            <Image
              priority
              src="/book-cat2.png"
              alt="Bookshelf"
              width={350}
              height={350}
              sizes="350px"
              placeholder="blur"
              blurDataURL="/book-cat2.png"
            />
          </div>
        </section>
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold" id="featured">
            Featured
          </h2>

          <Separator />
          <p className="text-lg mb-6 text-muted-foreground">Handpicked weekly by Kathrin.</p>

          <BookDisplay books={featuredBooks || []} />
        </section>
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">Latest Releases</h2>

          <Separator />
          <p className="text-lg mb-6 text-muted-foreground">Just posted.</p>
          <BookDisplay books={sortedBooks.slice(0, 8)} />

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
      </div>
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold mb-2">What Readers Are Saying</h2>

        <Separator />
        <div className="p-4 space-y-4">
          <p>⭐️ ⭐️ ⭐️ ⭐️ ⭐️</p>
          <p className="italic">
            "An amazing selection of books! I always find something new and
            exciting."
          </p>
          <p className="mt-2 text-right font-semibold">- Griffin Sherwood</p>
        </div>
        <div className="p-4 space-y-4">
          <p>⭐️ ⭐️ ⭐️ ⭐️ ⭐️</p>
          <p className="italic">
            "Kathrin's Books has become my go-to place for all my reading
            needs."
          </p>
          <p className="mt-2 text-right font-semibold">- B. Bean</p>
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold mb-2">About</h2>

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
    </>
  );
}
