"use server";
import { getAllBooks } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

const fetchBooks = cache(async () => {
  const supabase = createClient();
  const { data: books, error } = await getAllBooks(supabase);

  if (error) {
    console.error("Error fetching books:", error.message);
  }

  if (!books) {
    return [];
  }

  return books;
});

export { fetchBooks };
