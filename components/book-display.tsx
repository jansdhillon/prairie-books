"use client";
import { Database } from "@/utils/database.types";
import { Book } from "./book";
import { useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export type BookType = Database["public"]["Tables"]["books"]["Row"];

const BookDisplay = ({ books }: { books: BookType[] }) => {
  console.log("Books:", books);
  if (!books || books.length === 0) {
    return <p className="text-center">No books available at the moment.</p>;
  }

  return (
    <>
      <Carousel>
        <CarouselContent>
          {books.map((book: BookType) => (
            <Book key={book.id} book={book} />
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default BookDisplay;
