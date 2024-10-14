import { getUserDataById } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {


  const supabase = createClient();


  const { data: user } = await supabase.auth.getUser();


  if (!user.user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to view this page");
  }

  const { data: userData } = await getUserDataById(supabase, user?.user!.id);

  if (userData.is_admin !== true) {
    return encodedRedirect("error", "/", "You must be an admin to view this page");
  }

  return <div className="max-w-7xl flex flex-col gap-12 ">{children}</div>;
}
