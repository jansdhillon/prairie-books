import { addBookAction } from "@/app/actions/add-book";
import { getUserDataAction } from "@/app/actions/get-user";
import AddBookForm from "@/components/add-book-form";
import { Message } from "@/components/form-message";
import { getErrorRedirect } from "@/utils/helpers";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Message;
}) {
  const { data: userData, error: authError } = await getUserDataAction();

  if (authError) {
    redirect(
      getErrorRedirect("/", "Error fetching user data", authError.message)
    );
  }

  try {
    if (userData.is_admin !== true) {
      getErrorRedirect("/", "Error", "You must be an admin to view this page");
    }
  } catch (error) {
    getErrorRedirect("/", "Error", "You must be an admin to view this page");
  }
  return (
    <AddBookForm addBookAction={addBookAction} searchParams={searchParams} />
  );
}
