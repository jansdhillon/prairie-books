"use server";
import { createClient } from "@/utils/supabase/server";

const getUser = async (id: string) => {
// This is for the users table not the auth table
//Takes the auth.users.id and returns the user object from the users table
  const supabase = createClient();
  const { data: user, error } = await supabase.from("users").select("*").eq("id", id).single();

  console.log(user);

  if (error) {
    console.error("Error fetching books:", error.message);
  }


  return {userData: user};
};

export { getUser };
