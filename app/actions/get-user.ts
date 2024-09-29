"use server";
import { getUser, getUserData } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

const getUserAndUserData = async () => {
  const supabase = createClient();
  const user = await getUser(supabase);
  if (!user) {
    return null;
  }
  const userData = await getUserData(supabase, user.id);
  const data = {
    user: user,
    userData: userData.data,
  };
  return data;
};

export { getUserAndUserData };
