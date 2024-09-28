"use server";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { fixOneToOne } from "../fixOneToOne";
import { stripe } from "@/utils/stripe/config";
import { Database } from "@/utils/database.types";

export const cancelCheckoutAction = async () => {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return encodedRedirect(
        "error",
        "/sign-in",
        "You must be signed in to checkout."
      );
    }

    const userId = user.id;


    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (cartError || !cart) {
      console.error("Error fetching cart:", cartError?.message);
      return encodedRedirect("error", "/cart", "Your cart is empty.");
    }


    const { data: cartItems, error: cartItemsError } = await supabase
      .from("cart_items")
      .select("id, quantity, book:books(id, price, title)")
      .eq("cart_id", cart.id)

    if (cartItemsError || !cartItems || cartItems.length === 0) {
      console.error("Error fetching cart items:", cartItemsError?.message);
      return encodedRedirect("error", "/cart", "Your cart is empty.");
    }

    const { data: order, error: orderError } = await supabase
    .from("orders")
    .delete()
    .eq("user_id", userId)
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError.message);
    return encodedRedirect("error", "/cart", "Failed to create order.");
  }








    // const orderItemsData = cartItems.map((item) => ({
    //   order_id: order.id,
    //   book_id: fixOneToOne(item.book)?.id,
    //   quantity: item.quantity,
    //   price: fixOneToOne(item?.book)?.price,
    // }));

    // const { error: orderItemsError } = await supabase.from("order_items").delete().eq("order_id", orderItemsData.order_id);

    // if (orderItemsError) {
    //   console.error("Error creating order items:", orderItemsError.message);
    //   return encodedRedirect("error", "/cart", "Failed to process order items.");
    // }




    // return encodedRedirect("success", "/orders/[id]", order.id);

  };
