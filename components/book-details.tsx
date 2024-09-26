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
import { Suspense, useTransition } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Loading from "@/app/loading";

type BookDetailsProps = {
  book: BookType;
};

export function BookDetails({ book }: BookDetailsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const coverImage = book.image_directory
    ? `${book.image_directory}image-1.png`
    : "/placeholder.png";

  const additionalImages =
    book.num_images && book.num_images > 1
      ? Array.from(
          { length: book.num_images - 1 },
          (_, i) => `${book.image_directory}image-${i + 2}.png`
        )
      : [];

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
      <Suspense fallback={<Loading />}>
        <Carousel>
          <CarouselContent>
            <CarouselItem
              className={`flex flex-col  rounded-xl ${book.num_images && book.num_images > 1 ? "md:basis-1/2 lg:basis-1/3" : ""}`}
            >
              <div className="relative w-full h-[400px]  my-5">
                <Image
                  src={coverImage}
                  alt={book.title}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </CarouselItem>
            {additionalImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="flex flex-col md:basis-1/2 lg:basis-1/3 rounded-xl"
              >
                <div className="relative w-full h-[400px]  my-5">
                  <Image
                    priority
                    src={image}
                    alt={book.title}
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {book && (book.num_images ?? 0) > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </Suspense>

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
                <div className="flex items-start justify-between">
                  <div className="leading-loose">
                    <p>
                      <span className="text-primary font-semibold">
                        Author:
                      </span>{" "}
                      {book.author}
                    </p>
                  { book.isbn && <p>
                      <span className="text-primary font-semibold">ISBN:</span>{" "}
                      {book.isbn}
                    </p>}
                    {book.genre && <p>
                      <span className="text-primary font-semibold">Genre:</span>{" "}
                      {book.genre || "Not specified"}
                    </p>}
                    {book.original_release_date && <p>
                      <span className="text-primary font-semibold">
                        Original Release Date:
                      </span>{" "}
                      {book.original_release_date || "Not specified"}
                    </p>}
                    {book.publication_date && <p>
                      {" "}
                      <span className="text-primary font-semibold">
                        Publication Date:
                      </span>{" "}
                      {book.publication_date || "Not specified"}
                    </p>}
                    {book.publisher && <p>
                      {" "}
                      <span className="text-primary font-semibold">
                        Publisher:
                      </span>{" "}
                      {book.publisher || "Not specified"}
                    </p>}
                    {book.edition && <p>
                      <span className="text-primary font-semibold">
                        Edition:
                      </span>{" "}
                      {book.edition || "Not specified"}
                    </p>}
                    {book.condition && <p>
                      <span className="text-primary font-semibold">
                        Condition:
                      </span>{" "}
                      {book.condition || "Not specified"}
                    </p>}
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
                  <p className=" font-normal text-primary">
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
