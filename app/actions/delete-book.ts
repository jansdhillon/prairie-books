"use server";
import { Database } from "@/utils/database.types";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";
import { stripe } from "@/utils/stripe/config";
import { deletePriceRecord, deleteProductRecord } from "@/utils/supabase/admin";
import { getPriceByProductId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect} from "@/utils/utils";
import { Storage } from "@google-cloud/storage";
import { redirect } from "next/navigation";

export const deleteBook = async (formData: FormData) => {

  const productId = formData.get("product-id")?.toString().trim();
  const bookId = formData.get("book-id")?.toString().trim();


  const supabase = createClient();



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
    return redirect(
      getErrorRedirect("/admin", "Error", "Failed to delete the book.")
    );

  }

  const {data: price, error: error} = await getPriceByProductId(supabase, productId!);



  try{
    await deletePriceRecord(price.id);
    await deleteProductRecord(productId!);



  } catch (error) {
    console.error("Error deleting product and price records:", error);
  }




 const {error: deleteError} =  await supabase.from("books").delete().eq("id", bookId);


  if (deleteError) {
    console.error("Error deleting book:", deleteError.message);
    return redirect(
      getErrorRedirect("/admin", "Error", "Failed to delete the book.")
    );
  }




  try {
    await storage.bucket(bucketName).deleteFiles({ prefix: directoryPath });

  } catch (error) {
    console.error("Error deleting images from Google Cloud Storage:", error);
  }

  return redirect(
    getStatusRedirect("/admin", "Success", "Book deleted successfully!")
  );
};
