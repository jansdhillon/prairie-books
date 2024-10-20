"use server"
import { getStatusRedirect } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const firstName= formData.get("firstname")?.toString();
    const lastName = formData.get("lastname")?.toString();
    const fullName = firstName + " " + lastName;
    const password = formData.get("password")?.toString();
    const supabase = createClient();
    const origin = headers().get("origin");

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: { full_name: fullName },

      },
    });



    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    } else {
      return redirect(getStatusRedirect("/sign-in", "Success", "Please check your email to verify your account."));
    }
  };
