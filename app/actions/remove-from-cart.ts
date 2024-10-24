"use server";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { getStatusRedirect } from "@/utils/helpers";
import { redirect } from "next/navigation";

export const removeFromCartAction = async (cartItemId: string) => {
    const supabase = createClient();

    if (!cartItemId) {
      return encodedRedirect("error", "/cart", "Cart item ID is required.");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return encodedRedirect(
        "error",
        "/sign-in",
        "You must be signed in to add items to the cart."
      );
    }

    const userId = user.id;

    const { data: cartItem, error: cartItemError } = await supabase
      .from("cart_items")
      .select("id, cart_id")
      .eq("id", cartItemId)
      .single();

    if (cartItemError) {
      console.error("Error fetching cart item:", cartItemError.message);
      return encodedRedirect("error", "/cart", "Failed to remove item from cart.");
    }

    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id, user_id")
      .eq("id", cartItem.cart_id)
      .single();

    if (cartError || cart.user_id !== userId) {
      return encodedRedirect("error", "/cart", "Unauthorized action.");
    }

    const { error: deleteError } = await supabase.from("cart_items").delete().eq("id", cartItemId);

    if (deleteError) {
      console.error("Error deleting cart item:", deleteError.message);
      return encodedRedirect("error", "/cart", "Failed to remove item from cart.");
    }

    return redirect(
      getStatusRedirect("/cart", "Item removed from cart")
    );
  };
