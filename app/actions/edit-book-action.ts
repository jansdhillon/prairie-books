"use server";
import { Database } from "@/utils/database.types";
import { stripe } from "@/utils/stripe/config";
import { upsertPriceRecord, upsertProductRecord } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Storage } from "@google-cloud/storage";

export const editBookAction = async (formData: FormData) => {
  const supabase = createClient();

  const bookId = formData.get("book-id")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const author = formData.get("author")?.toString().trim();
  const isbn = formData.get("isbn")?.toString().trim();
  const priceStr = formData.get("price")?.toString().trim();
  const price = priceStr ? parseFloat(priceStr) : null;
  const genre = formData.get("genre")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const publisher = formData.get("publisher")?.toString().trim() || null;
  const language = formData.get("language")?.toString().trim() || null;
  const files = formData.getAll("images") as File[];
  const is_featured = formData.has("is-featured") ? true : false;
  const edition = formData.get("edition")?.toString().trim() || null;
  const publicationDate = formData.get("publication-date")?.toString().trim() || null;
  const originalReleaseDate = formData.get("original-release-date")?.toString().trim() || null;
  const condition = formData.get("condition")?.toString().trim() || null;

  const filteredFiles = files.filter((file) => file.size > 0);

  const directoryPath = `${isbn}/`;

  let hasImages = false;
  const numImages = filteredFiles.length;
  const bucketName = "kathrins-books-images";
  const storage = new Storage();

  // Validate mandatory fields
  if (!title || !author || !isbn || price === null || isNaN(price)) {
    return encodedRedirect(
      "error",
      "/",
      "Title, Author, ISBN, and Price are required, and Price must be a number."
    );
  }

  const { data: existingBook, error: getError } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (getError || !existingBook) {
    console.error("Error retrieving book:", getError?.message || "Book not found");
    return encodedRedirect("error", "/admin/edit", "Book not found.");
  }

  if (filteredFiles.length > 0) {
    hasImages = true;
    for (let i = 0; i < filteredFiles.length; i++) {
      const file = filteredFiles[i];
      if (file && typeof file === "object" && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${directoryPath}image-${i + 1}.png`;

        try {
          await storage.bucket(bucketName).file(filename).save(buffer);
        } catch (error) {
          console.error("Error occurred while uploading file:", error);
        }
      }
    }
  }

  const updatedBook: Partial<Database["public"]["Tables"]["books"]["Update"]> = {
    title,
    author,
    isbn,
    price,
    genre,
    description,
    publisher,
    language,
    image_directory: hasImages
      ? `https://storage.googleapis.com/${bucketName}/${directoryPath}`
      : existingBook.image_directory,
    is_featured,
    edition,
    publication_date: publicationDate,
    num_images: numImages,
    original_release_date: originalReleaseDate,
    condition,
  };

  const { data: updated, error: updateError } = await supabase
    .from("books")
    .update(updatedBook)
    .eq("id", bookId);

  if (updateError) {
    console.error("Error updating book:", updateError.message);
    return encodedRedirect("error", "/admin/edit", "Failed to update the book.");
  }

  console.log("Updated book:", updated);


  return encodedRedirect("success", "/admin", "Book updated successfully!");
};
