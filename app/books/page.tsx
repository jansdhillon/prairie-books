import { createClient } from "@/utils/supabase/server";

export default async function Notes() {
  const supabase = createClient();
  let { data: books, error } = await supabase.from("books").select("*");

  console.log(books);

  return <pre>{JSON.stringify(books, null, 2)}</pre>;
}
