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

  try {
    const { userData } = await getUser(user.id);

    if (userData.is_admin !== true) {
      encodedRedirect("error", "/", "You must be an admin to view this page");
    }
  } catch (error) {
    encodedRedirect("error", "/", "You must be an admin to view this page");
  }

  return <div className="max-w-7xl flex flex-col gap-12 ">{children}</div>;
}
