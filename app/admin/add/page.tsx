import { addBookAction } from "@/app/actions/add-book";
import AddBookForm from "@/components/add-book-form";
import { Message } from "@/components/form-message";

export default async function HomePage({searchParams}: {searchParams: Message}) {
  return <AddBookForm addBookAction={addBookAction} searchParams={searchParams} />;
}
