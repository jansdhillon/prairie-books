"use server";
import { getAllBooks } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

const fetchBooks = async () => {
  const supabase = createClient();
  const { data: books, error } = await getAllBooks(supabase);

  if (error) {
    console.error("Error fetching books:", error.message);
  }

  if (!books) {
    return [];
  }

  return books;
};

export { fetchBooks };
