"use server";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const addToCartAction = async (formData: FormData) => {
    const supabase = createClient();
    const bookId = formData.get("bookId")?.toString();
    const quantityStr = formData.get("quantity")?.toString();
    const quantity = quantityStr ? parseInt(quantityStr) : 1;

    if (!bookId) {
      return encodedRedirect("error", "/books", "Book ID is required.");
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

    // Get or create the user's cart
    let { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (cartError && cartError.code === "PGRST116") {
      // Cart does not exist, create one
      const { data: newCart, error: newCartError } = await supabase
        .from("cart")
        .insert({ user_id: userId })
        .select("*")
        .single();

      if (newCartError) {
        console.error("Error creating cart:", newCartError.message);
        return encodedRedirect("error", "/books", "Failed to create cart.");
      }

      cart = newCart;
    } else if (cartError) {
      console.error("Error fetching cart:", cartError.message);
      return encodedRedirect("error", "/books", "Failed to fetch cart.");
    }


    const { data: existingCartItem, error: cartItemError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("book_id", bookId)
      .single();

    if (cartItemError && cartItemError.code !== "PGRST116") {
      console.error("Error checking cart item:", cartItemError.message);
      return encodedRedirect("error", "/books", "Failed to add item to cart.");
    }

    if (existingCartItem) {
      // Update quantity
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingCartItem.quantity + quantity })
        .eq("id", existingCartItem.id);

      if (updateError) {
        console.error("Error updating cart item:", updateError.message);
        return encodedRedirect("error", "/books", "Failed to update cart item.");
      }
    } else {
      // Add new item to cart
      const { error: insertError } = await supabase.from("cart_items").insert({
        cart_id: cart.id,
        book_id: bookId,
        quantity,
      });

      if (insertError) {
        console.error("Error adding item to cart:", insertError.message);
        return encodedRedirect("error", "/books", "Failed to add item to cart.");
      }
    }

    return encodedRedirect("success", "/cart", "Item added to cart.");
  };
