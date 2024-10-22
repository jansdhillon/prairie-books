"use server";
import { getAllBooks as fetchBooks } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

const getAllBooks = cache(async () => {
  const supabase = createClient();
  const { data: books, error } = await fetchBooks(supabase);

  if (error) {
    console.error("Error fetching books:", error.message);
  }

  if (!books) {
    return [];
  }

  return books;
});

export { getAllBooks };
