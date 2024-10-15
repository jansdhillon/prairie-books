"use server";
import { stripe } from "@/utils/stripe/config";

import { getProductByBookId } from "./get-product";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Storage } from "@google-cloud/storage";
import { redirect } from "next/navigation";
import { getStatusRedirect } from "@/utils/helpers";
import Stripe from "stripe";

export const editBookAction = async (formData: FormData) => {
  const supabase = createClient();

  const bookId = formData.get("book-id")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const author = formData.get("author")?.toString().trim();
  const isbn = formData.get("isbn")?.toString().trim();
  const priceStr = formData.get("price")?.toString().trim();
  const price = priceStr ? parseFloat(priceStr) : null;
  const genresStr = formData.get("genres")?.toString().trim();
  const genres = genresStr ? genresStr.split(",") : [];
  const description = formData.get("description")?.toString().trim() || null;
  const publisher = formData.get("publisher")?.toString().trim() || null;
  const language = formData.get("language")?.toString().trim() || null;
  const files = formData.getAll("images") as File[];
  const is_featured = formData.has("is-featured") ? true : false;
  const edition = formData.get("edition")?.toString().trim() || null;
  const publicationDate =
    formData.get("publication-date")?.toString().trim() || null;
  const condition = formData.get("condition")?.toString().trim() || null;

  const filteredFiles = files.filter((file) => file.size > 0);

  const directoryPath = `${bookId}/`;

  let hasImages = false;
  const numImages = filteredFiles.length;
  const bucketName = "kathrins-books-images";
  const storage = new Storage();

  if (!bookId || !title || !author || price === null || isNaN(price)) {
    return encodedRedirect(
      "error",
      "/admin",
      "Title, Author, and Price are required, and Price must be a number."
    );
  }

  const { data: existingBook, error: getError } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (getError || !existingBook) {
    console.error(
      "Error retrieving book:",
      getError?.message || "Book not found"
    );
    return encodedRedirect("error", "/admin/edit", "Book not found.");
  }

  let imageDirectory = existingBook.image_directory;

  const deletedImageIndicesStr = formData
    .get("deleted-image-indices")
    ?.toString()
    .trim();
  const deletedImageIndices = deletedImageIndicesStr
    ? JSON.parse(deletedImageIndicesStr)
    : [];

  if (deletedImageIndices && deletedImageIndices.length > 0) {
    for (const deletedImageIndex of deletedImageIndices) {
      const imageIndex = parseInt(deletedImageIndex, 10);
      if (imageIndex >= 0 && imageIndex < existingBook.num_images) {
        const filename = `${directoryPath}image-${imageIndex + 1}.png`;
        try {
          await storage.bucket(bucketName).file(filename).delete();
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    }
  }

  const existingNumImages = existingBook.num_images || 0;
  const imagesToDelete = deletedImageIndices.length;

  const allImageIndices = Array.from(
    { length: existingNumImages },
    (_, i) => i
  );

  const remainingImageIndices = allImageIndices.filter(
    (index) => !deletedImageIndices.includes(index)
  );

  const highestExistingIndex =
    remainingImageIndices.length > 0 ? Math.max(...remainingImageIndices) : -1;

  let nextImageIndex = highestExistingIndex + 1;

  if (filteredFiles.length > 0) {
    hasImages = true;
    imageDirectory = `https://storage.googleapis.com/${bucketName}/${directoryPath}`;

    for (let i = 0; i < filteredFiles.length; i++) {
      const file = filteredFiles[i];
      if (file && typeof file === "object" && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${directoryPath}image-${nextImageIndex + 1}.png`;
        nextImageIndex++;

        try {
          await storage.bucket(bucketName).file(filename).save(buffer);
        } catch (error) {
          console.error("Error occurred while uploading file:", error);
        }
      }
    }
  }
  const updatedNumImages = remainingImageIndices.length + filteredFiles.length;

  const updatedBook = {
    title,
    author,
    isbn,
    price,
    genre: genres,
    description,
    publisher,
    language,
    image_directory: hasImages ? imageDirectory : existingBook.image_directory,
    is_featured,
    edition,
    publication_date: publicationDate,
    num_images: updatedNumImages,
    condition,
  };

  const { error: updateError } = await supabase
    .from("books")
    .update(updatedBook)
    .eq("id", bookId);

  if (updateError) {
    console.error("Error updating book:", updateError.message);
    return redirect(
      getStatusRedirect("/admin", "Error", "Failed to update book...")
    );
  }

  const product = await getProductByBookId(bookId);
  const productId = product.id;

  if (productId) {
    try {
      const metadata: Stripe.MetadataParam = {
        bookId: bookId,
        author,
        genres: JSON.stringify(genres),
        publisher,
        language,
        edition,
      };

      for (const key in metadata) {
        if (metadata[key]) {
          metadata[key] = metadata[key]!.toString().substring(0, 500);
        }
      }

      await stripe.products.update(productId, {
        name: title,
        description: author || undefined,
        metadata,
      });

      const existingPrices = product.prices;
      const existingPrice = existingPrices[0];
      const existingUnitAmount = existingPrice.unit_amount;

      if (price * 100 !== existingUnitAmount) {
        for (const oldPrice of existingPrices) {
          await stripe.prices.update(oldPrice.id, {
            active: false,
          });
        }

        await stripe.prices.create({
          unit_amount: Math.round(price * 100),
          currency: "cad",
          product: productId,
        });
      }

    } catch (err) {
      console.error("Error updating Stripe product or price:", err);
      return encodedRedirect(
        "error",
        "/admin",
        "Failed to update product in Stripe."
      );
    }
  }

  return redirect(
    getStatusRedirect("/admin", "Success", "Book updated successfully!")
  );
};
