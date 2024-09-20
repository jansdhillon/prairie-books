"use server";
import { createClient } from "@/utils/supabase/server";

const fetchBooks = async () => {
  const supabase = createClient();
  const { data: books, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("Error fetching books:", error.message);
  }

  if (!books) {
    return [];
  }

  return books;
};

export { fetchBooks };
