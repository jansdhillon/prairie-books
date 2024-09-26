"use server";
import { Database } from "@/utils/database.types";
import { stripe } from "@/utils/stripe/config";
import { deletePriceRecord, deleteProductRecord } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Storage } from "@google-cloud/storage";

export const deleteBook = async (formData: FormData) => {

  const id = formData.get("book-id")?.toString().trim();


  const supabase = createClient();


  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, isbn, image_directory")
    .eq("id", id)
    .single();

  const storage = new Storage();
  const bucketName = "kathrins-books-images";
  const directoryPath = `${book?.isbn}/`;



  if (bookError || !book) {
    console.error("Error fetching book:", bookError?.message);
    return encodedRedirect("error", "/", "Book not found.");

  }

  try{
    await deleteProductRecord(book.id);

    await deletePriceRecord(book.id);

  } catch (error) {
    console.error("Error deleting product and price records:", error);
  }




  await supabase.from("books").delete().eq("id", id);




  try {
    await storage.bucket(bucketName).deleteFiles({ prefix: directoryPath });

  } catch (error) {
    console.error("Error deleting images from Google Cloud Storage:", error);
  }

  return encodedRedirect("success", "/admin", "Book deleted successfully!");
};
