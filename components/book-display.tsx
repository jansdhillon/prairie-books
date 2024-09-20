"use client";
import { Database } from "@/utils/database.types";
import { Book } from "./book";
import { useEffect } from "react";

export type BookType = Database["public"]["Tables"]["books"]["Row"];

const BookDisplay = ({books}: {books: BookType[]}) => {


  console.log("Books:", books);
  if (!books || books.length === 0) {
    return <p className="text-center">No books available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book: BookType) => (
        <Book key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookDisplay;
