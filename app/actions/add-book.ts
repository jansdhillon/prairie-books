"use server";
import { Database } from "@/utils/database.types";
import { stripe } from "@/utils/stripe/config";
import { upsertPriceRecord, upsertProductRecord } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

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
    const cover_image_url = formData.get("cover_image_url")?.toString().trim() || null;

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
      cover_image_url,
    };

    const { error } = await supabase.from("books").insert([newBook]);

    if (error) {
      console.error("Error adding book:", error.message);
      return encodedRedirect("error", "/protected", "Failed to add the book. Please try again.");
    }


    const product = await stripe.products.create({
      name: title,
      metadata: {
        author,
        isbn,
        genre,
        publisher,
        language,
      },
    });

    const stripePrice = await stripe.prices.create({
      unit_amount: price,
      currency: 'cad',
      product: product.id,
    });

    await upsertProductRecord(product);
    await upsertPriceRecord(stripePrice);


    console.log(`Book ${title} added successfully.`);

    return encodedRedirect("success", "/protected", "Book added successfully!");
  };
