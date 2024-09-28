import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { getUser } from "../actions/get-user";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
    error: userError,
  } = await createClient().auth.getUser();

  if (userError) {
    encodedRedirect("error", "/", "You must be signed in to view this page");
  }

  if (!user) {
    encodedRedirect(
      "error",
      "/sign-in",
      "You must be signed in to view this page"
    );
  }


  return <div>{children}</div>;
}
