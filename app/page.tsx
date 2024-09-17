import { createClient } from "@/utils/supabase/server";
import BookDisplay from "@/components/book-display";

export default async function HomePage() {
  const supabase = createClient();

  const { data: books, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("Error fetching books:", error.message);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome to Kathrin's Books 📚
      </h1>
      <BookDisplay books={books || []} />
    </div>
  );
}
