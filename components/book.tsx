"use client";

import { BookType } from "./book-display";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { addToCartAction } from "@/app/actions/add-to-cart";
import { use, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { getBookCover } from "@/app/actions/get-book-cover";
import { DownloadResponse } from "@google-cloud/storage";

type BookProps = {
  book: BookType;
};

export const Book = ({ book }: BookProps) => {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("bookId", book.id);
      formData.append("quantity", "1");
      addToCartAction(formData);
    });
  };

  const [bookCover, setBookCover] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookCover = async () => {
      const coverImageFile = await getBookCover(book.isbn);
      if (coverImageFile instanceof Buffer) {
        const blob = new Blob([coverImageFile], {type: "image/png"});
        const url = URL.createObjectURL(blob);
        setBookCover(url);
        console.log("Fetched book cover:", coverImageFile);
      } else {
        console.error("Error fetching book cover:", coverImageFile);
      }
    }
    book.cover_image_url && fetchBookCover();

    return () => {
      if (bookCover) {
        URL.revokeObjectURL(bookCover);
      }
    };
  }, [book.id]);


  return (
    <Card>
      <CardHeader>
        <Image
          src={bookCover ? bookCover[0] : "/placeholder.png"}
          alt={book.title}
          width={400}
          height={300}
          className="h-48 w-full object-cover"
        />
        <h2 className="text-xl font-semibold">{book.title}</h2>
        <p>Author: {book.author}</p>
      </CardHeader>
      <CardContent>
        <p>ISBN: {book.isbn}</p>
        <p>Price: ${book.price.toFixed(2)}</p>
        <p>Genre: {book.genre}</p>
        <Button onClick={handleAddToCart} disabled={isPending}>
          {isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
};
