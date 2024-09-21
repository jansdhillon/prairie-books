import { addBookAction } from "@/app/actions/add-book";
import AddBookForm from "@/components/add-book-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUser } from "../../actions/get-user";
import { Database } from "@/utils/database.types";

export default async function HomePage() {

  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  console.log(user);

  const {userData} = await getUser(user.id);


  console.log(userData);


  if (userData.is_admin !== true) {
    return redirect("/");
  }



  return <AddBookForm addBookAction={addBookAction} />;
}
