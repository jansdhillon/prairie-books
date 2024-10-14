import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { getErrorRedirect } from "@/utils/helpers";
import { getAllUserData } from "@/utils/supabase/queries";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data: userData, error } = await getAllUserData(supabase);

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }


  return <div>{children}</div>;
}
