import { fetchBooks } from "./actions/fetch-books";
import { getFeaturedBooks } from "./actions/get-featured-books";
import BookDisplay from "@/components/book-display";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

export default async function HomePage() {
  const books = await fetchBooks();
  const featuredBooks = await getFeaturedBooks();

  const sortedBooks = books.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex flex-col space-y-12 px-12   md:px-10 py-12 max-w-7xl mx-auto">
      <section className="flex flex-col-reverse md:flex-row gap-12 items-center justify-between space-y-6 md:space-y-0 md:mb-20 ">
        <div className="md:w-1/2 md:pl-3">
          <h1 className="text-5xl font-bold mb-4">
            Find Your Next Page-Turner
          </h1>
          <p className="text-lg  mb-6 ">
            Discover a curated selection of rare books. From classics to modern
            books, Kathrin has something for every reader.
          </p>
          <Link href="/books">
            <Button variant={"default"} className="flex items-center space-x-2">
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
            quality={100}
            className="rounded-xl"
          />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-2" id="featured">
          Featured
        </h2>
        <div className="space-y-6 mt-6">
          <Separator />
          <p className="text-md mb-6">Handpicked weekly by Kathrin.</p>

          <BookDisplay books={featuredBooks || []} />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-2">Latest Releases</h2>
        <div className="space-y-6 mt-6">
          <Separator />
          <p className="text-md mb-6">Just posted.</p>
          <BookDisplay books={sortedBooks.slice(0, 8)} />
        </div>
      </section>

      <div className="flex justify-center w-full mx-auto container">
        <Link href="/books">
          <Button className="flex items-center justify-center space-x-2 mt-6">
            <span>View All Books</span>
            <ArrowRightIcon />
          </Button>
        </Link>
      </div>

      {/* <section>
        <h2 className="text-3xl font-semibold mb-2">Categories</h2>
        <Separator />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {[
            "Fiction",
            "Non-Fiction",
            "Mystery",
            "Romance",
            "Science Fiction",
            "Biography",
          ].map((category) => (
            <Link
              href={`/books/category/${category.toLowerCase()}`}
              key={category}
              className="p-4 border rounded-lg hover:bg-secondary/50 backdrop-blur-sm transition"
            >
              {category}
            </Link>
          ))}
        </div>
      </section> */}

      <section>
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

      <section>
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

      {/* <section className="bg-gray-100 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
        <p className="mb-4">
          Subscribe to our newsletter for the latest updates and exclusive
          offers.
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border rounded-md w-full sm:w-auto"
            required
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </section> */}
    </div>
  );
}
