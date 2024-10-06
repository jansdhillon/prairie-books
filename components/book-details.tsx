"use client";;
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/app/actions/add-to-cart";
import { Suspense, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft, Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Loading from "@/app/loading";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { User } from "@supabase/auth-js";
import { getUserAndUserData } from "@/app/actions/get-user";
import { Database } from "@/utils/database.types";
import { BookType } from "@/lib/types/types";

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

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<
    Database["public"]["Tables"]["users"]["Row"] | null
  >(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserAndUserData();
      const user = data?.user;
      const userData = data?.userData;
      if (!user || !userData) {
        return;
      }
      setUser(user);
      setUserData(userData);
    };

    fetchUserData();
  }, []);

  return (
    <div className="w-full space-y-8 px-1">
      <div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      <Suspense fallback={<Loading />}>
        <Carousel className="mx-6 md:mx-0">
          <CarouselContent>
            <CarouselItem
              className={`flex flex-col  rounded-xl ${book.num_images && book.num_images > 1 ? "md:basis-1/2 lg:basis-1/3" : ""}`}
            >
              <Link href={`${coverImage}`}>
                <div className="relative w-full h-[400px]  my-5">
                  <Image
                    src={coverImage}
                    alt={book.title}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </Link>
            </CarouselItem>
            {additionalImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="flex flex-col md:basis-1/2 lg:basis-1/3 rounded-xl"
              >
                <Link href={`${image}`} className="relative w-full h-[400px]  my-5">
                  <Image
                    src={image}
                    alt={book.title}
                    fill
                    className="object-contain rounded-xl"
                  />
                </Link>
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

      <div className="flex md:flex-col items-center gap-4 justify-between">
        <div className="flex-1 w-full">
          <CardHeader className="text-muted-foreground">
            <div className="flex md:flex-col justify-between items-start flex-row ">
              <div className="flex items-baseline">
                <CardTitle className="text-3xl font-semibold text-primary mb-4">
                  {book.title}
                </CardTitle>
                {user && userData && userData?.is_admin && (
                  <Link className="mx-5" href={`/admin/edit/${book.id}`}>
                    <Pen size={20} width={20} height={20} />
                  </Link>
                )}
              </div>
            </div>
            <Separator className="my-4" />

            <div className="space-y-2 pb-4">
              <p>
                <span className="text-primary font-semibold">Author(s):</span>{" "}
                {book.author}
              </p>
              {book.isbn && (
                <p>
                  <span className="text-primary font-semibold">ISBN:</span>{" "}
                  {book.isbn}
                </p>
              )}
              {book.genre &&
                book.genre.map((g) => g.split(",").filter((g) => g.length > 0))
                  .length > 0 && (
                  <div className="flex gap-1">
                    <span className="text-primary font-semibold">
                      Genre(s):
                    </span>{" "}
                    <div className="space-x-1">
                      {book.genre.map((g) =>
                        g
                          .split(",")
                          .filter((g) => g.length > 0)
                          .map((g) => <Badge key={g}>{g}</Badge>)
                      )}
                    </div>
                  </div>
                )}
              {/* {book.original_release_date && (
                <p>
                  <span className="text-primary font-semibold">
                    Original Release Date:
                  </span>{" "}
                  {book.original_release_date || "Not specified"}
                </p>
              )} */}
              {book.publication_date && (
                <p>
                  {" "}
                  <span className="text-primary font-semibold">
                    Publication Date:
                  </span>{" "}
                  {book.publication_date || "Not specified"}
                </p>
              )}
              {book.publisher && (
                <p>
                  {" "}
                  <span className="text-primary font-semibold">
                    Publisher:
                  </span>{" "}
                  {book.publisher || "Not specified"}
                </p>
              )}
              {book.edition && (
                <p>
                  <span className="text-primary font-semibold">Edition:</span>{" "}
                  {book.edition || "Not specified"}
                </p>
              )}
              {book.condition && (
                <p>
                  <span className="text-primary font-semibold">Condition:</span>{" "}
                  {book.condition || "Not specified"}
                </p>
              )}
            </div>
            <div className="flex flex-col justify-between items-end">
              <p className="text-xl font-semibold text-primary mb-4">
                ${book.price.toFixed(2)} CAD
              </p>

              <Button onClick={handleAddToCart} disabled={isPending}>
                {isPending ? (
                  "Adding to Cart..."
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
              Description
            </h3>
            <Separator className="my-4" />
            <p className="leading-relaxed">{book.description || "No description available."}</p>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
