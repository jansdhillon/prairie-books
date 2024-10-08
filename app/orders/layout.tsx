import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { getUserAndUserData } from "../actions/get-user";
import { getErrorRedirect } from "@/utils/helpers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getUserAndUserData();

  const user = data?.user;
  const userData = data?.userData;

  if (!user) {
    getErrorRedirect(
      "error",
      "/sign-in",
      "You must be signed in to view this page"
    );
  }


  return <div>{children}</div>;
}
