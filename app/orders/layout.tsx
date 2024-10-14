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

  const { data: {authUser, usersData}, error } = await getAllUserData(supabase);

  if (!authUser || error) {
    getErrorRedirect(
      "error",
      "/sign-in",
      "You must be signed in to view this page"
    );
  }


  return <div>{children}</div>;
}
