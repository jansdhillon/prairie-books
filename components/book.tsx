"use client";

import { BookType } from "./book-display";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/app/actions/add-to-cart";
import { useTransition } from "react";
import Image from "next/image";
import { CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

type BookProps = {
  book: BookType;
};

export function Book({ book }: BookProps) {
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
    <Card className="flex flex-col justify-between h-full">
      <CardHeader className="text-muted-foreground">
        <div className="relative w-full h-[400px]  my-5">
          <Image
            src={book.cover_img_url || "/placeholder.png"}
            alt={book.title}
            fill
            className="object-contain rounded-lg"
          />
        </div>
        <CardTitle className="text-xl font-semibold text-primary">
          {book.title}
        </CardTitle>
        <Separator />
        <p> by {book.author}</p>
      </CardHeader>
      <CardContent className="line-clamp-2  text-ellipsis">
        <p>{book.description || "No description available."}</p>
      </CardContent>
      <CardFooter className="p-4 flex my-4 justify-end gap-4">
        <Button
          onClick={handleAddToCart}
          size="sm"
          variant="default"
          disabled={isPending}
        >
          {isPending ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />${book.price.toFixed(2)}
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/books/${book.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
