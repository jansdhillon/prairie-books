import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { getUserAndUserData } from "../actions/get-user";
import { getErrorRedirect } from "@/utils/helpers";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getUserAndUserData();

  const user = data?.user;
  const userData = data?.userData;

  if (!user) {
    encodedRedirect(
      "error",
      "/sign-in",
      "You must be signed in to view this page"
    );
  }

  if (userData.is_admin !== true) {
    getErrorRedirect("/", "Error", "You must be an admin to view this page");
  }

  return <div className="max-w-7xl flex flex-col gap-12 ">{children}</div>;
}
