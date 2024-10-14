"use server";;
import { getUserDataById } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

const getUserDataAction = async () => {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { data: null, error: "User not found" };
  }

  const { data: userData, error: authError } = await getUserDataById(supabase, user?.user!.id);

  return { data: userData, error: authError };
};

export { getUserDataAction };
