"use server";
import { createClient } from "@/utils/supabase/server";
import {
  getAllUserData,
  getCartDetailsByUserId,
} from "@/utils/supabase/queries";
import { redirect } from "next/navigation";
import { getErrorRedirect } from "@/utils/helpers";
import { getUserDataAction } from "./get-user";

export const startCheckoutAction = async () => {
  const supabase = createClient();

  const { data: userData, error: authError } = await getUserDataAction();

  if (authError) {
    return redirect(getErrorRedirect("/sign-in", authError.message));
  }

  if (!userData) {
    return redirect(getErrorRedirect("/sign-in", "Error fetching user data"));
  }

  const { data: cartDetails, error: cartError } = await getCartDetailsByUserId(
    supabase,
    userData.id
  );

  return {
    amount: cartDetails.total,
    cartDetails: cartDetails.cart_items,
    userData: userData,
  };
};
