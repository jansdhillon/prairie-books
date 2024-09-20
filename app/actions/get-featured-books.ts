"use server";
import { createClient } from "@/utils/supabase/server";

const getFeaturedBooks = async () => {
  const supabase = createClient();
  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .eq("is_featured", true);

  if (error) {
    console.error("Error fetching books:", error.message);
  }

  if (!books) {
    return [];
  }

  return books;
};

export { getFeaturedBooks };
