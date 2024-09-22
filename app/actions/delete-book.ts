"use server";
import { Database } from "@/utils/database.types";
import { stripe } from "@/utils/stripe/config";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Storage } from "@google-cloud/storage";

export const deleteBook = async (isbn: string) => {
  const supabase = createClient();
  const storage = new Storage();
  const bucketName = "kathrins-books-images";
  const directoryPath = `${isbn}/`;

  // Step 1: Retrieve the book record to get the product ID and price ID
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, image_directory")
    .eq("isbn", isbn)
    .single();

  if (bookError || !book) {
    console.error("Error fetching book:", bookError?.message);
    return encodedRedirect("error", "/", "Book not found.");
  }

  // Step 2: Delete associated product and price from Stripe
  const productId = book.id; // Assuming product ID is the same as the book ID
  const priceId = ""; // Fetch the corresponding price ID as needed

  try {
    await stripe.products.del(productId);
    console.log(`Product ${productId} deleted from Stripe.`);
  } catch (error) {
    console.error("Error deleting product from Stripe:", error);
  }

  try {
    await stripe.prices.update(priceId, { active: false });
    console.log(`Price ${priceId} deleted from Stripe.`);
  } catch (error) {
    console.error("Error deleting price from Stripe:", error);
  }

  // Step 3: Remove book record from Supabase
  const { error: deleteError } = await supabase
    .from("books")
    .delete()
    .eq("isbn", isbn);

  if (deleteError) {
    console.error("Error deleting book from Supabase:", deleteError.message);
    return encodedRedirect("error", "/", "Failed to delete the book. Please try again.");
  }

  // Step 4: Delete images from Google Cloud Storage
  try {
    await storage.bucket(bucketName).deleteFiles({ prefix: directoryPath });
    console.log(`Images for ${isbn} deleted from Google Cloud Storage.`);
  } catch (error) {
    console.error("Error deleting images from Google Cloud Storage:", error);
  }

  console.log(`Book with ISBN ${isbn} deleted successfully.`);
  return encodedRedirect("success", "/", "Book deleted successfully!");
};
