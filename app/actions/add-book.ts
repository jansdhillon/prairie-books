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
  const file = formData.get("book-cover");
  const is_featured = formData.get("is-featured") === "true";

  if (file && typeof file === 'object') {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${isbn}.png`;

    console.log("filename", filename);
    try {
      const bucketName = "kathrins-books-images";

      const storage = new Storage();

      const uploadFile = async () => {
        await storage.bucket(bucketName).file(filename).save(buffer);
        console.log(`${filename} uploaded to ${bucketName}`);
      };

      const data = await uploadFile();
      console.log("data", data);
    } catch (error) {
      console.log("Error occured ", error);
    }


  }



  if (!title || !author || !isbn || price === null || isNaN(price)) {
    return encodedRedirect(
      "error",
      "/protected",
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
    cover_img_url: `https://storage.googleapis.com/kathrins-books-images/${isbn}.png`,
    is_featured,
  };

  const { error } = await supabase.from("books").insert([newBook]);

  if (error) {
    console.error("Error adding book:", error.message);
    return encodedRedirect(
      "error",
      "/protected",
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
      cover_img_url: `https://storage.googleapis.com/kathrins-books-images/${isbn}.png`,
    },
  });

  const stripePrice = await stripe.prices.create({
    unit_amount: price,
    currency: "cad",
    product: product.id,
  });

  await upsertProductRecord(product);
  await upsertPriceRecord(stripePrice);

  console.log(`Book ${title} added successfully.`);

  return encodedRedirect("success", "/protected", "Book added successfully!");
};