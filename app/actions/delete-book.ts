"use server";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";
import { deletePriceRecord, deleteProductRecord } from "@/utils/supabase/admin";
import { getPriceByProductId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
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
