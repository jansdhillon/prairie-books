"use server";
import { Database } from "@/utils/database.types";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";
import { stripe } from "@/utils/stripe/config";
import { updateBookImageDirectory } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Storage } from "@google-cloud/storage";
import { redirect } from "next/navigation";

export const addBookAction = async (formData: FormData) => {
  const supabase = createClient();

  const title = formData.get("title")?.toString().trim();
  const author = formData.get("author")?.toString().trim();
  const isbn = formData.get("isbn")?.toString().trim();
  const priceStr = formData.get("price")?.toString().trim();
  const price = priceStr ? parseFloat(priceStr) : null;
  const genres = formData.getAll("genres") as string[];
  const description = formData.get("description")?.toString().trim() || null;
  const publisher = formData.get("publisher")?.toString().trim() || null;
  const language = formData.get("language")?.toString().trim() || null;
  const files = formData.getAll("images") as File[];
  const is_featured = formData.has("is-featured") ? true : false;
  const edition = formData.get("edition")?.toString().trim() || null;
  const publicationDate =
    formData.get("publication-date")?.toString().trim() || null;
  const condition = formData.get("condition")?.toString().trim() || null;

  const fileterdFiles = files.filter((file) => file.size > 0);

  let hasImages = false;

  const numImages = fileterdFiles.length;

  const bucketName = "kathrins-books-images";

  const storage = new Storage();

  if (!title || !author ||  price === null || isNaN(price)) {
    return encodedRedirect(
      "error",
      "/admin",
      "Title, Author, and Price are required and Price must be a number."
    );
  }

  const newBook = {
    title,
    author,
    isbn,
    price,
    genre: genres,
    description,
    publisher,
    language,

    is_featured,

    edition,
    publication_date: publicationDate,
    num_images: numImages,
    condition,
    stock: 1,
  };

  const { data: book, error } = await supabase
    .from("books")
    .insert([newBook])
    .select("*")
    .single();

  const directoryPath = `${book?.id}/`;

  const imageDirectory = `https://storage.googleapis.com/${bucketName}/${directoryPath}`;

  if (hasImages) {
    const { error } = await updateBookImageDirectory(
      supabase,
      book?.id!,
      imageDirectory
    );

    if (error) {
      console.error("Error updating book image directory:", error.message);
      return redirect(
        getErrorRedirect("/admin", "Failed to update book image directory.")
      );
    }
  }
  if (error) {
    console.error("Error adding book:", error.message);
    return redirect(getErrorRedirect("/admin", "Failed to add book."));
  }

  const product = await stripe.products.create({
    name: title,
    description: author,
    images: [`${imageDirectory}image-1.png`],

    metadata: {
      bookId: book?.id!,
      author,
      genres: JSON.stringify(genres),
      publisher,
      language,
      edition,
    },
  });

  await stripe.prices.create({
    unit_amount: Math.round(price * 100),
    currency: "cad",
    product: product.id,
  });

  const { error: updateError } = await supabase
    .from("books")
    .update({ product_id: product.id })
    .eq("id", book?.id!);

  if (updateError) {
    console.error("Error updating book with product_id:", updateError.message);
    return redirect(
      getErrorRedirect("/admin", "Failed to update book with product_id.")
    );
  }

  if (fileterdFiles.length > 0) {
    hasImages = true;
    for (let i = 0; i < fileterdFiles.length; i++) {
      const file = fileterdFiles[i];
      if (file && typeof file === "object" && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${directoryPath}image-${i + 1}.png`;

        try {
          const uploadFile = async () => {
            await storage.bucket(bucketName).file(filename).save(buffer);
          };

          await uploadFile();
        } catch (error) {
          console.error("Error occurred while uploading file:", error);
        }
      }
    }
  }

  return redirect(
    getStatusRedirect("/admin", "Success", "Book added successfully!")
  );
};
