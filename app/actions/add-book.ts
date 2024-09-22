"use server";
import { Database } from "@/utils/database.types";
import { stripe } from "@/utils/stripe/config";
import { upsertPriceRecord, upsertProductRecord } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Storage } from "@google-cloud/storage";

export const addBookAction = async (formData: FormData) => {
  const supabase = createClient();

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


  console.log(files);

  const directoryPath = `${isbn}/`;



  const bucketName = "kathrins-books-images";

  const storage = new Storage();

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && typeof file === "object" && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${directoryPath}image-${i + 1}.png`;

        try {
          const uploadFile = async () => {
            await storage.bucket(bucketName).file(filename).save(buffer);
          };

          await uploadFile();
        } catch (error) {
          console.log("Error occurred while uploading file:", error);
        }
      }
    }
  }

  if (!title || !author || !isbn || price === null || isNaN(price)) {
    return encodedRedirect(
      "error",
      "/",
      "Title, Author, ISBN, and Price are required and Price must be a number."
    );
  }

  const newBook: Database["public"]["Tables"]["books"]["Insert"] = {
    title,
    author,
    isbn,
    price,
    genre,
    description,
    publisher,
    language,
    image_directory: `https://storage.googleapis.com/${bucketName}/${directoryPath}`,
    is_featured,
    edition,
  };

  const { error } = await supabase.from("books").insert([newBook]);

  if (error) {
    console.error("Error adding book:", error.message);
    return encodedRedirect(
      "error",
      "/",
      "Failed to add the book. Please try again."
    );
  }

  const product = await stripe.products.create({
    name: title,
    metadata: {
      author,
      isbn,
      genre,
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

  console.log(`Book ${title} added successfully.`);

  return encodedRedirect("success", "/", "Book added successfully!");
};
