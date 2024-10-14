"use server";
import { getStatusRedirect } from "@/utils/helpers";
import {
  createCart,
  getOrCreateCart,
  getProductAndPriceByBookId,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

export const addToCartAction = async (formData: FormData) => {
  const supabase = createClient();
  const bookId = formData.get("bookId")?.toString();
  const quantityStr = formData.get("quantity")?.toString();
  const quantity = quantityStr ? parseInt(quantityStr) : 1;

  if (!bookId) {
    return encodedRedirect("error", "/books", "Book ID is required.");
  }

  const { data: product, error } = await getProductAndPriceByBookId(
    supabase,
    bookId
  );

  if (error) {
    console.error("Error fetching product:", error.message);
    return encodedRedirect("error", "/books", "Failed to fetch product.");
  }

  if (!product) {
    return encodedRedirect("error", "/books", "Product not found.");
  }

  if (!bookId) {
    return encodedRedirect("error", "/books", "Book ID is required.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be signed in to add items to the cart."
    );
  }

  const userId = user.id;

  const { data: cartDetails, error: cartError } = await getOrCreateCart(
    supabase,
    userId
  );

  if (cartError) {
    console.error("Error fetching cart:", cartError.message);
    return encodedRedirect("error", "/books", "Failed to fetch cart.");
  }

  const { data: existingCartItem, error: cartItemError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartDetails.id)
    .eq("book_id", bookId)
    .maybeSingle();

  if (cartItemError) {
    console.error("Error checking cart item:", cartItemError.message);
    return encodedRedirect("error", "/books", "Failed to add item to cart.");
  }

  if (existingCartItem) {
    return encodedRedirect("error", "/cart", "Item already in cart.");
  } else {
    const { error: insertError } = await supabase.from("cart_items").insert({
      cart_id: cartDetails.id,
      book_id: bookId,
      product_id: product.id,
      quantity,
    });

    if (insertError) {
      console.error("Error adding item to cart:", insertError.message);
      return encodedRedirect("error", "/books", "Failed to add item to cart.");
    }
  }

  return redirect(getStatusRedirect("/cart", "Success", "Item added to cart!"));
};
