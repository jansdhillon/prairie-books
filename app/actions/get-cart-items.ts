"use server";;
import { createClient } from "@/utils/supabase/server";
import { fixOneToOne } from "../fixOneToOne";
import { Database } from "@/utils/database.types";

export type CartItemType = Database["public"]["Tables"]["cart_items"]["Row"];

export const getCartItemsAction = async (userId: string) => {

    const supabase = createClient();
    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return { cartItems: [] };
    }

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
