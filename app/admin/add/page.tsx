import { addBookAction } from "@/app/actions/add-book";
import AddBookForm from "@/components/add-book-form";

export default async function HomePage() {
  return <AddBookForm addBookAction={addBookAction} />;
}
