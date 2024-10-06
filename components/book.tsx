"use client";


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
import { Badge } from "./ui/badge";
import { BookType } from "@/lib/types/types";

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

  const coverImage = book.image_directory
    ? `${book.image_directory}image-1.png`
    : "/placeholder.png";

  return (
    <Card className=" rounded-xl drop-shadow-sm flex flex-col justify-between h-full max-h-[800px]  backdrop-blur-sm">
      <CardHeader className="text-muted-foreground">
        <Link
          className="relative w-full h-[400px]"
          href={`/books/${book.id}`}
        >
          <Image
            src={coverImage}
            alt={book.title}
            fill
            sizes="400px"
            className="object-contain rounded-lg"
          />
        </Link>
        <CardTitle className="text-xl font-semibold text-primary line-clamp-2 text-ellipsis">
          {book.title}
        </CardTitle>
        <Separator />
        <p> by {book.author}</p>
        {book.genre && (
          <div  className="">
            {book.genre.map((g) =>
              g
                .split(",")
                .filter((g) => g.length > 0)
                .map((g) => <Badge key={g} className="mr-0.5"><p className="line-clamp-1 max-w-[200px]">{g}</p></Badge>)
            )}
          </div>
        )}
      </CardHeader>
      {book.description && (
        <CardContent className="line-clamp-4   text-ellipsis">
          <p className="text-ellipsis">{book.description || "No description available."}</p>
        </CardContent>
      )}

      <CardFooter className="p-4 flex my-4 justify-end gap-4">
        <Button
          onClick={handleAddToCart}
          size="sm"
          variant="default"
          disabled={isPending || book.stock === 0}
        >
          {isPending ? (
            "Adding..."
          ) : (
            <>
              {book.stock > 0 ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> $
                  {book.price.toFixed(2)}
                </>
              ) : (
                `Sold for $${book.price.toFixed(2)}`
              )}
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
