"use server";
import { getAllUserData } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { data } from "autoprefixer";

const getUserDataAction = async () => {
  const supabase = createClient();

  const { data: userData, error: authError } = await getAllUserData(supabase);

  return { data: userData, error: authError };
};

export { getUserDataAction };
