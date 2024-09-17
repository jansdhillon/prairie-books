import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BookDisplay from "@/components/book-display";
import AddBookForm from "@/components/add-book-form";
import Feedback from "@/components/feedback";
import { addBookAction } from "@/app/actions/add-book";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: books, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("Error fetching books:", error.message);
  }

  return (
    <div className="container mx-auto p-6">
      {/* Feedback Message */}
      <Feedback />

      {/* Add Book Form */}
      <AddBookForm addBookAction={addBookAction} />

      {/* Books List */}
      {/* <BookDisplay books={books || []} /> */}
    </div>
  );
}
