"use client";

import { ReactNode, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { get } from "http";

export const DeleteBookForm = ({
  deleteBook,
  bookId,
  alertDialogAction,
  getProductByBookId,
}: {
  deleteBook: (formData: FormData) => void;
  bookId: string;
  alertDialogAction: ReactNode;
  getProductByBookId: (bookId: string) => Promise<any>;
}) => {
  const [productId, setProductId] = useState<string | null>(null);


  useEffect(() => {
    const fetchProductId = async () => {
      try {
        const product = await getProductByBookId(bookId);


        if (!product) {
          console.error("Product not found.");
          return;
        }

        setProductId(product.id);
      } catch (error) {
        console.error("Unexpected error fetching product:", error);
      }
    };

    fetchProductId();
  }, [bookId, getProductByBookId]);

  return (
    <form action={deleteBook}>
      <Input type="hidden" name="book-id" defaultValue={bookId} readOnly />
      {productId && (
        <Input type="hidden" name="product-id" defaultValue={productId} readOnly />
      )}
      {alertDialogAction}
    </form>
  );
};
