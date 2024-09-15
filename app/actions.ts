"use server";

import { encodedRedirect } from "@/utils/utils"
import { createClient } from "@/app/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Database } from "@/app/utils/database.types";
import { stripe } from "@/app/utils/stripe/config";
import { upsertPriceRecord, upsertProductRecord } from "@/app/utils/supabase/admin";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (email === process.env.ADMIN_EMAIL) {
    return redirect("/admin");
  }else {
    return redirect("/protected");
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

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
