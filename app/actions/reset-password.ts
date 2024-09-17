"use server"
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
      encodedRedirect(
        "error",
        "/reset-password",
        "Password and confirm password are required",
      );
    }

    if (password !== confirmPassword) {
      encodedRedirect(
        "error",
        "/reset-password",
        "Passwords do not match",
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      encodedRedirect(
        "error",
        "/reset-password",
        "Password update failed",
      );
    }

    encodedRedirect("success", "/reset-password", "Password updated");
  };
