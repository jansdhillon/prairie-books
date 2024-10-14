import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { getErrorRedirect } from "@/utils/helpers";
import { getUserDataById } from "@/utils/supabase/queries";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to view this page");
  }



  return <div>{children}</div>;
}
