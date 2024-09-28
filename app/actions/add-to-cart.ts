"use server";
import { getCartByUserId, getProductAndPriceByBookId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { get } from "http";

export const addToCartAction = async (formData: FormData) => {
    const supabase = createClient();
    const bookId = formData.get("bookId")?.toString();
    const quantityStr = formData.get("quantity")?.toString();
    const quantity = quantityStr ? parseInt(quantityStr) : 1;


    if (!bookId) {
        return encodedRedirect("error", "/books", "Book ID is required.");
    }


    const {data: product, error} = await getProductAndPriceByBookId(supabase, bookId)


    if (error) {
        console.error("Error fetching product:", error.message);
        return encodedRedirect("error", "/books", "Failed to fetch product.");
    }

    if (!product) {
        return encodedRedirect("error", "/books", "Product not found.");
    }


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

    let { data: cart, error: cartError } = await getCartByUserId(supabase, userId);

    if (cartError && cartError.code === "PGRST116") {
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
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingCartItem.quantity + quantity })
        .eq("id", existingCartItem.id);

      if (updateError) {
        console.error("Error updating cart item:", updateError.message);
        return encodedRedirect("error", "/books", "Failed to update cart item.");
      }
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        cart_id: cart.id,
        book_id: bookId,
        product_id: product.id,
        quantity,
      });

      if (insertError) {
        console.error("Error adding item to cart:", insertError.message);
        return encodedRedirect("error", "/books", "Failed to add item to cart.");
      }
    }

    return encodedRedirect("success", "/cart", "Item added to cart.");
  };
