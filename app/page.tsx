// app/page.tsx

import { createClient } from "@/utils/supabase/server";
import BookDisplay from "@/components/book-display";

export default async function HomePage() {
  const supabase = createClient();

  const { data: books, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("Error fetching books:", error.message);
    // Optionally, handle the error (e.g., display a message to the user)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Prairie Books 📚</h1>
      <BookDisplay books={books || []} />
    </div>
  );
}
