"use client";

import { BookType } from "./book-display";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
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
    <Card className="flex flex-col justify-between">

      <div>
        <div className="relative w-full h-64 md:h-[500px]">
          <Image
            src={book.cover_img_url || "/placeholder.png"}
            alt={book.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-md p-4"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>
        <CardHeader className="text-muted-foreground">
          <h2 className="text-xl font-semibold text-primary ">{book.title}</h2>
          <p >Author: {book.author}</p>
          <p >ISBN: {book.isbn}</p>
          <p >Price: ${book.price.toFixed(2)}</p>
          <p>Genre: {book.genre || "Not specified"}</p>
        </CardHeader>
        <CardContent className="py-2 line-clamp-4 overflow-scroll">
          <p>{book.description || "No description available."}</p>
        </CardContent>
      </div>

      <CardFooter className="p-4 flex  justify-end my-4">
        <Button onClick={handleAddToCart} disabled={isPending} size="sm">
          {isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};
