// components/book.tsx

"use client";

import { BookType } from "./book-display";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { addToCartAction } from "@/app/actions/add-to-cart";
import { useTransition } from "react";
import Image from "next/image";

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

  return (
    <Card>
      <CardHeader>
        <Image
          src={book.cover_image_url || ""}
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
