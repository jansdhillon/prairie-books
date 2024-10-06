"use server";
import { Database } from "@/utils/database.types";
import { getStatusRedirect } from "@/utils/helpers";
import { stripe } from "@/utils/stripe/config";
import { upsertPriceRecord, upsertProductRecord } from "@/utils/supabase/admin";
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
  const originalReleaseDate =
    formData.get("original-release-date")?.toString().trim() || null;
  const condition = formData.get("condition")?.toString().trim() || null;


  const fileterdFiles = files.filter((file) => file.size > 0);

  const directoryPath = `${isbn}/`;

  let hasImages = false;

  const numImages = fileterdFiles.length;

  const bucketName = "kathrins-books-images";

  const storage = new Storage();

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

  if (!title || !author || !isbn || price === null || isNaN(price)) {
    return redirect(
      getStatusRedirect(
        "/admin",
        "Error",
        "Title, Author, ISBN, and Price are required and Price must be a number."
      )
    );
  }

  const newBook: Database["public"]["Tables"]["books"]["Insert"] = {
    title,
    author,
    isbn,
    price,
    genre: genres,
    description,
    publisher,
    language,
    image_directory: hasImages
      ? `https://storage.googleapis.com/${bucketName}/${directoryPath}`
      : null,
    is_featured,

    edition,
    publication_date: publicationDate,
    num_images: numImages,
    original_release_date: originalReleaseDate,
    condition,
    stock: 1,
  };

  const { data: book, error } = await supabase.from("books").insert([newBook]);

  if (error) {
    console.error("Error adding book:", error.message);
    return encodedRedirect(
      "error",
      "/",
      "Failed to add the book. Please try again."
    );
  }

  const { data: newBookId, error: newBookError } = await supabase
    .from("books")
    .select("id")
    .eq("isbn", isbn)
    .eq("title", title)
    .single();

  const product = await stripe.products.create({
    name: title,
    metadata: {
      bookId: newBookId?.id!,
      author,
      isbn,
      genres: JSON.stringify(genres),
      publisher,
      language,
      edition,
    },
  });

  const stripePrice = await stripe.prices.create({
    unit_amount: Math.round(price * 100),
    currency: "cad",
    product: product.id,
  });

  await upsertProductRecord(product);
  await upsertPriceRecord(stripePrice);

  const { error: updateError } = await supabase
      .from("books")
      .update({ product_id: product.id })
      .eq("id", newBookId?.id!);

    if (updateError) {
      console.error("Error updating book with product_id:", updateError.message);
      return encodedRedirect(
        "error",
        "/",
        "Failed to update the book with the product ID. Please try again."
      );
    }

  return redirect(
    getStatusRedirect("/admin", "Success", "Book added successfully!")
  );
};
