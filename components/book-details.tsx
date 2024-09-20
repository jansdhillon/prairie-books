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
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BookDetailsProps = {
  book: BookType;
};

export function BookDetails({ book }: BookDetailsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("bookId", book.id);
      formData.append("quantity", "1");
      addToCartAction(formData);
    });
  };

  return (
    <div className="container mx-auto px-4 ">
      <div className="flex flex-col gap-8">
        <div className="flex">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <div className="grid grid-cols-2 justify-items-center place-items-center ">
          <Image
            src={book.cover_img_url || "/placeholder.svg?height=400&width=300"}
            alt={book.title}
            height={400}
            width={300}
            className="rounded-lg"
          />

          <CardHeader className="text-muted-foreground">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <CardTitle className="text-3xl font-semibold text-primary mb-4">
                  {book.title}
                </CardTitle>
                <Separator className="my-4" />
                <div className="space-y-3">
                    <p >Author: {book.author}</p>
                    <p >ISBN: {book.isbn}</p>
                    <p >Genre: {book.genre || "Not specified"}</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="text-primary">
                    {book.description || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardFooter className="w-full flex justify-end  items-center space-x-4">
          <p className="text-xl font-semibold">
            Price: ${book.price.toFixed(2)}
          </p>
          <Button onClick={handleAddToCart} disabled={isPending} size="lg">
            {isPending ? (
              "Adding to Cart..."
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
