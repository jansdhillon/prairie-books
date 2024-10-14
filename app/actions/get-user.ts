"use server";
import { getUserDataById } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

const getUserDataAction = async () => {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to view this page");
  }

  const { data: userData, error: authError } = await getUserDataById(supabase, user?.user!.id);

  return { data: userData, error: authError };
};

export { getUserDataAction };
