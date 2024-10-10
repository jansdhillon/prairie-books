"use client";
import { Database } from "@/utils/database.types";
import { Book } from "./book";
import { Suspense, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Loading from "@/app/loading";
import { BookType } from "@/lib/types/types";

const BookDisplay = ({ books }: { books: BookType[] }) => {
  if (!books || books.length === 0) {
    return <p className="text-center">No books available at the moment.</p>;
  }

  function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const results: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  }

  const itemsPerRow = 20;
  const bookRows = chunkArray(books, itemsPerRow);

  return (
    <>
      <Suspense fallback={<Loading />}>
        {bookRows.map((row, rowIndex) => (
          <Carousel className="mx-6 md:mx-0" key={rowIndex}>
            <CarouselContent>
              {row.map((book: BookType) => (
               <CarouselItem className="flex flex-col md:basis-1/2 lg:basis-1/3 rounded-xl" key={book.id}>
                  <Book key={book.id} book={book} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ))}
      </Suspense>
    </>
  );
};

export default BookDisplay;
