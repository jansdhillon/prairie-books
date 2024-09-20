"use server";
import { createClient } from "@/utils/supabase/server";

const getBookById = async (bookId: string) => {
  const supabase = createClient();
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (error) {
    console.error("Error fetching book:", error.message);
  }

  if (!book) {
    return null;
  }

  return book;
};

export { getBookById };
