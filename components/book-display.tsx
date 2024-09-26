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

export type BookType = Database["public"]["Tables"]["books"]["Row"];

const BookDisplay = ({ books }: { books: BookType[] }) => {
  if (!books || books.length === 0) {
    return <p className="text-center">No books available at the moment.</p>;
  }

  return (
    <>
      <Suspense fallback={<Loading/>}>
        <Carousel>
          <CarouselContent>
            {books.map((book: BookType) => (
              <CarouselItem className="flex flex-col md:basis-1/2 lg:basis-1/3 rounded-xl" key={book.id}>
                <Book key={book.id} book={book} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Suspense>
    </>
  );
};

export default BookDisplay;
