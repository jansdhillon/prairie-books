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
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

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
    <div className="container mx-auto w-full space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      <Carousel>
        <CarouselContent>
          <Image
            src={book.cover_img_url || "/placeholder.png"}
            alt={book.title}
            height={400}
            width={300}
            className="rounded-lg"
          />
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex items-center gap-4 justify-between">
        <div className="flex flex-col w-full">
          <CardHeader className="text-muted-foreground">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <CardTitle className="text-3xl font-semibold text-primary mb-4">
                    {book.title}
                  </CardTitle>
                  <p className="text-xl font-semibold text-primary">
                    ${book.price.toFixed(2)} CAD
                  </p>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <p>
                      <span className="text-primary font-semibold">Author:</span>{" "}
                      {book.author}
                    </p>
                    <p>
                      <span className="text-primary font-semibold">ISBN:</span>{" "}
                      {book.isbn}
                    </p>
                    <p>
                      <span className="text-primary font-semibold">Genre:</span>{" "}
                      {book.genre || "Not specified"}
                    </p>
                    <p> <span className="text-primary font-semibold">Publication Date:</span>{" "}
                    {book.publication_date || "Not specified"}</p>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isPending}
                    size="lg"
                  >
                    {isPending ? (
                      "Adding to Cart..."
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                      </>
                    )}
                  </Button>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2 text-primary">
                    Description
                  </h3>
                  <p className="">
                    {book.description || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardFooter className="w-full flex justify-end  items-center space-x-4"></CardFooter>
        </div>
      </div>
    </div>
  );
}
