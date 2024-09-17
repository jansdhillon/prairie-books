"use server";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { fixOneToOne } from "../fixOneToOne";
import { CartItemType } from "../cart/page";

export const getCartItemsAction = async () => {
    const supabase = createClient();

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

    // Get the user's cart
    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return { cartItems: [] };
    }

    // Get cart items with book details
    const { data: cartItemsData, error: cartItemsError } = await supabase
      .from("cart_items")
      .select("id, quantity, book:books(*)")
      .eq("cart_id", cart.id);

    if (cartItemsError) {
      console.error("Error fetching cart items:", cartItemsError.message);
      return { cartItems: [] };
    }

    const cartItems = fixOneToOne(cartItemsData) as unknown as CartItemType[];

    return { cartItems };
  };
