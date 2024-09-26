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

  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, image_directory")
    .eq("isbn", isbn)
    .single();

  if (bookError || !book) {
    console.error("Error fetching book:", bookError?.message);
    return encodedRedirect("error", "/", "Book not found.");

  }

  try {
    await storage.bucket(bucketName).deleteFiles({ prefix: directoryPath });

  } catch (error) {
    console.error("Error deleting images from Google Cloud Storage:", error);
  }

  return encodedRedirect("success", "/", "Book deleted successfully!");
};
