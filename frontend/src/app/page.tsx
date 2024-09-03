import { Footer } from "@/components/footer";
import { getBooks } from "@/app/actions/getBooks";
import { Nav } from "@/components/nav";
import { startAdmin } from "./actions/startAdmin";
import { Book } from "lucide-react";
import BookStore from "@/components/BookStore";

const Page = async () => {
  // const pb = await startAdmin();
  // const books = await getBooks(pb);
  //
  // console.log(books);
  return (
    <>
      <Nav />
      <div className="flex flex-col min-h-[100dvh] pt-24">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 ">
            <div className="container px-6 ">

              <BookStore books={books} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Page;
