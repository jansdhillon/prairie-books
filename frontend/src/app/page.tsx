import { Footer } from "@/components/footer";
import { getBooks } from "@/app/actions/getBooks";
import { Nav } from "@/components/nav";
import { startAdmin } from "./actions/startAdmin";

const Page = async () => {
  const pb = await startAdmin();
  const books = await getBooks(pb);
  console.log(books);
  return (
    <>
      <Nav />
      <div className="flex flex-col min-h-[100dvh] pt-24">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 ">
            <div className="container px-6 ">
              <div className="flex flex-col items-center space-y-6 md:space-y-10 text-center">
                Buy books in Calgary, Alberta
              </div>
              {books.map((book: any) => (
                <div
                  key={book.id}
                  className="flex flex-col items-center space-y-6 md:space-y-10 text-center text-primary"
                >
                  <h2>{book.Title}</h2>
                  <p>{book.Author}</p>
                  <p>{book.price}</p>
                  <p>{book.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Page;
