"use server";

import { encodedRedirect } from "@/utils/utils"
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "@/utils/database.types";
import { stripe } from "@/utils/stripe/config";
import { upsertPriceRecord, upsertProductRecord } from "@/utils/supabase/admin";
import { fixOneToOne } from "./fixOneToOne";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
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
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (email === process.env.ADMIN_EMAIL) {
    return redirect("/admin");
  }else {
    return redirect("/protected");
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

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

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const addBookAction = async (formData: FormData) => {
  const supabase = createClient();

  const title = formData.get("title")?.toString().trim();
  const author = formData.get("author")?.toString().trim();
  const isbn = formData.get("isbn")?.toString().trim();
  const priceStr = formData.get("price")?.toString().trim();
  const price = priceStr ? parseFloat(priceStr) : null;
  const genre = formData.get("genre")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const publisher = formData.get("publisher")?.toString().trim() || null;
  const language = formData.get("language")?.toString().trim() || null;
  const cover_image_url = formData.get("cover_image_url")?.toString().trim() || null;

  if (!title || !author || !isbn || price === null || isNaN(price)) {
    return encodedRedirect(
      "error",
      "/protected",
      "Title, Author, ISBN, and Price are required and Price must be a number."
    );
  }

  const newBook: Database["public"]["Tables"]["books"]["Insert"] = {
    title,
    author,
    isbn,
    price,
    genre,
    description,
    publisher,
    language,
    cover_image_url,
  };

  const { error } = await supabase.from("books").insert([newBook]);

  if (error) {
    console.error("Error adding book:", error.message);
    return encodedRedirect("error", "/protected", "Failed to add the book. Please try again.");
  }


  const product = await stripe.products.create({
    name: title,
    metadata: {
      author,
      isbn,
      genre,
      publisher,
      language,
    },
  });

  const stripePrice = await stripe.prices.create({
    unit_amount: price,
    currency: 'cad',
    product: product.id,
  });

  await upsertProductRecord(product);
  await upsertPriceRecord(stripePrice);


  console.log(`Book ${title} added successfully.`);

  return encodedRedirect("success", "/protected", "Book added successfully!");
};

export const addToCartAction = async (formData: FormData) => {
  const supabase = createClient();
  const bookId = formData.get("bookId")?.toString();
  const quantityStr = formData.get("quantity")?.toString();
  const quantity = quantityStr ? parseInt(quantityStr) : 1;

  if (!bookId) {
    return encodedRedirect("error", "/books", "Book ID is required.");
  }

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to add items to the cart.");
  }

  const userId = session.user.id;

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

  // Check if the item is already in the cart
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


export const removeFromCartAction = async (formData: FormData) => {
  const supabase = createClient();
  const cartItemId = formData.get("cartItemId")?.toString();

  if (!cartItemId) {
    return encodedRedirect("error", "/cart", "Cart item ID is required.");
  }

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to modify the cart.");
  }

  const userId = session.user.id;

  // Ensure the cart item belongs to the user's cart
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

  // Delete the cart item
  const { error: deleteError } = await supabase.from("cart_items").delete().eq("id", cartItemId);

  if (deleteError) {
    console.error("Error deleting cart item:", deleteError.message);
    return encodedRedirect("error", "/cart", "Failed to remove item from cart.");
  }

  return encodedRedirect("success", "/cart", "Item removed from cart.");
};


export const getCartItemsAction = async () => {
  const supabase = createClient();

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return { cartItems: [] };
  }

  const userId = session.user.id;

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
  const { data: cartItems, error: cartItemsError } = await supabase
    .from("cart_items")
    .select("id, quantity, book:books(*)")
    .eq("cart_id", cart.id);

  if (cartItemsError) {
    console.error("Error fetching cart items:", cartItemsError.message);
    return { cartItems: [] };
  }

  return { cartItems };
};


export const checkoutAction = async () => {
  const supabase = createClient();

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to checkout.");
  }

  const userId = session.user.id;

  // Get the user's cart
  const { data: cart, error: cartError } = await supabase
    .from("cart")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (cartError || !cart) {
    console.error("Error fetching cart:", cartError?.message);
    return encodedRedirect("error", "/cart", "Your cart is empty.");
  }

  // Get cart items with book details
  const { data: cartItems, error: cartItemsError } = await supabase
    .from("cart_items")
    .select("id, quantity, book:books(id, price, title)")
    .eq("cart_id", cart.id)

  if (cartItemsError || !cartItems || cartItems.length === 0) {
    console.error("Error fetching cart items:", cartItemsError?.message);
    return encodedRedirect("error", "/cart", "Your cart is empty.");
  }

  // Calculate total amount
  const amount = cartItems.reduce((total, item) => {
    return total + item.quantity * fixOneToOne(item?.book)?.price;
  }, 0);

  // Create a PaymentIntent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: "cad",
    metadata: {
      user_id: userId,
    },
  });

  // Create an order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      payment_intent_id: paymentIntent.id,
    })
    .select("*")
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError.message);
    return encodedRedirect("error", "/cart", "Failed to create order.");
  }


  const orderItemsData = cartItems.map((item) => ({
    order_id: order.id,
    book_id: fixOneToOne(item.book)?.id,
    quantity: item.quantity,
    price: fixOneToOne(item?.book)?.price,
  }));

  const { error: orderItemsError } = await supabase.from("order_items").insert(orderItemsData);

  if (orderItemsError) {
    console.error("Error creating order items:", orderItemsError.message);
    return encodedRedirect("error", "/cart", "Failed to process order items.");
  }

  // Clear the cart
  const { error: clearCartError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (clearCartError) {
    console.error("Error clearing cart:", clearCartError.message);
    return encodedRedirect("error", "/cart", "Failed to clear cart.");
  }

  // Store payment information in the payments table
  const paymentData: Database["public"]["Tables"]["payments"]["Insert"] = {
    order_id: order.id,
    payment_intent_id: paymentIntent.id,
    amount: amount,
    currency: "CAD",
    status: paymentIntent.status,
  };

  const { error: paymentError } = await supabase.from("payments").insert(paymentData);

  if (paymentError) {
    console.error("Error storing payment info:", paymentError.message);
    return encodedRedirect("error", "/cart", "Failed to store payment information.");
  }

  // Redirect to payment page or return client secret
  return {
    clientSecret: paymentIntent.client_secret,
  };
};
