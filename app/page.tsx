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
              modern books, Kathrin has something for every reader.
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

              quality={100}
              className="rounded-xl"
              loading="eager"
            />
          </div>
        </section>
        <section>
          <h2 className="text-3xl font-semibold" id="featured">
            Featured
          </h2>
          <div className="space-y-6 mt-6">
            <Separator />
            <p className="text-md mb-6">Handpicked weekly by Kathrin.</p>

            <BookDisplay books={featuredBooks || []} />
          </div>
        </section>
        <section>
          <h2 className="text-3xl font-semibold">Latest Releases</h2>
          <div className="space-y-6 mt-6">
            <Separator />
            <p className="text-md mb-6">Just posted.</p>
            <BookDisplay books={sortedBooks.slice(0, 8)} />
          </div>
          <Link href="/books" className="flex items-center justify-center py-6">
            <Button className="flex items-center justify-center space-x-2">
              <span>View All Books</span>
              <ArrowRightIcon />
            </Button>
          </Link>
        </section>

      </div>
      <section className="pt-6">
        <h2 className="text-3xl font-semibold mb-2">What Readers Are Saying</h2>
        <Separator />
        <div className="space-y-6 mt-6">
          <div className="p-4 bg-secondary/50 backdrop-blur-sm rounded-xl border ">
            <p className="italic">
              "An amazing selection of books! I always find something new and
              exciting."
            </p>
            <p className="mt-2 text-right font-semibold">- Griffin Sherwood</p>
          </div>
          <div className="p-4 bg-secondary/50 backdrop-blur-sm rounded-xl border ">
            <p className="italic">
              "Kathrin's Books has become my go-to place for all my reading
              needs."
            </p>
            <p className="mt-2 text-right font-semibold">- B. Bean</p>
          </div>
        </div>
      </section>
      <section className="pt-6">
        <h2 className="text-3xl font-semibold mb-2">About</h2>
        <Separator />
        <div className="flex leading-loose items-center  gap-5 mt-4 ">
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
            Kathrin's Books is an online bookstore curated by Kathrin, offering
            a wide range of books selected with love and care. Our mission is to
            connect readers with their next great read.
          </p>
        </div>
      </section>
    </>
  );
}
