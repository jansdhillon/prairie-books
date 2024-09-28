"use server";
import { Database } from "@/utils/database.types";
import { stripe } from "@/utils/stripe/config";
import { deletePriceRecord, deleteProductRecord } from "@/utils/supabase/admin";
import { getPriceByProductId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Storage } from "@google-cloud/storage";

export const deleteBook = async (formData: FormData) => {

  const productId = formData.get("product-id")?.toString().trim();
  const bookId = formData.get("book-id")?.toString().trim();


  const supabase = createClient();

  console.log("Deleting book with ID:", bookId);
  console.log("Deleting product with ID:", productId);


  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, isbn, image_directory")
    .eq("id", bookId)
    .single();

  const storage = new Storage();
  const bucketName = "kathrins-books-images";
  const directoryPath = `${book?.isbn}/`;



  if (bookError || !book) {
    console.error("Error fetching book:", bookError?.message);
    return encodedRedirect("error", "/", "Book not found.");

  }

  const {data: price, error: error} = await getPriceByProductId(supabase, productId!);



  try{
    await deletePriceRecord(price.id);
    await deleteProductRecord(productId!);



  } catch (error) {
    console.error("Error deleting product and price records:", error);
  }




  await supabase.from("books").delete().eq("id", bookId);




  try {
    await storage.bucket(bucketName).deleteFiles({ prefix: directoryPath });

  } catch (error) {
    console.error("Error deleting images from Google Cloud Storage:", error);
  }

  return encodedRedirect("success", "/admin", "Book deleted successfully!");
};
