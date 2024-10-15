import { editBookAction } from "@/app/actions/edit-book-action";
import { getBookById } from "@/app/actions/get-book-by-id";
import EditBookForm from "@/components/edit-book-form";
import { Message } from "@/components/form-message";

export default async function EditBookPage({
  searchParams,
  params,
}: {
  searchParams: Message;
  params: { id: string };
}) {
  const book = await getBookById(params.id);

  if (!book) {
    return <div>Book not found</div>;
  }

  return <EditBookForm book={book} editBookAction={editBookAction} />;
}
