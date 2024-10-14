"use server";
import { createClient } from "@/utils/supabase/server";
import {
  getOrCreateCart,
  getUserDataById,
} from "@/utils/supabase/queries";
import { redirect } from "next/navigation";
import { getErrorRedirect } from "@/utils/helpers";
import { encodedRedirect } from "@/utils/utils";

export const startCheckoutAction = async () => {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();


  if (!user.user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to view this page");
  }

  const { data: userData } = await getUserDataById(supabase, user?.user!.id);


  if (!userData) {
    return redirect(getErrorRedirect("/sign-in", "Error fetching user data"));
  }

  const { data: cartDetails, error: cartError } = await getOrCreateCart(
    supabase,
    userData.id
  );

  return {
    amount: cartDetails.total,
    cartDetails: cartDetails.cart_items,
    userData: userData,
  };
};
