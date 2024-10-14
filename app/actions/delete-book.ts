"use server";;
import { getStatusRedirect } from "@/utils/helpers";
import { stripe } from "@/utils/stripe/config";
import { getProductAndPriceByBookId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Storage } from "@google-cloud/storage";
import { redirect } from "next/navigation";

export const deleteBook = async (formData: FormData) => {
  const productId = formData.get("product-id")?.toString().trim();
  const bookId = formData.get("book-id")?.toString().trim();

  const supabase = createClient();

  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, image_directory")
    .eq("id", bookId)
    .single();

  const storage = new Storage();
  const bucketName = "kathrins-books-images";
  const directoryPath = `${book?.id}/`;

  if (bookError || !book) {
    console.error("Error fetching book:", bookError?.message);
    return encodedRedirect("error", "/admin", "Failed to fetch book.");
  }

  if (!productId) {
    return encodedRedirect("error", "/admin", "Product ID is required.");
  }

  try {
    await storage.bucket(bucketName).deleteFiles({ prefix: directoryPath });
  } catch (error) {
    console.error("Error deleting images from Google Cloud Storage:", error);
  }

  await supabase.from("books").delete().eq("id", book.id);

  const { data: product, error: productError } = await getProductAndPriceByBookId(supabase, book.id);

  if (productError) {
    console.error("Error fetching product:", productError.message);
    return encodedRedirect("error", "/admin", "Failed to fetch product.");
  }

  if (!product) {
    return encodedRedirect("error", "/admin", "Product not found.");
  }

  for (const price of product.prices.data) {
    await stripe.prices.update(price.id, { active: false });
  }

  await stripe.products.del(productId);



};
