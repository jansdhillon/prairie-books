import { EnhancedCartItemType, OrderItemType, OrderType } from "@/lib/types/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { encodedRedirect } from "../utils";

export const getUserDataById = cache(
  async (supabase: SupabaseClient, userId: string) => {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error.message);
      return { data: null, error };
    }
    return { data: userData, error: error };
  }
);

export const getAllBooks = cache(async (supabase: SupabaseClient) => {
  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: books, error };
});

export const getBookById = cache(
  async (supabase: SupabaseClient, bookId: string) => {
    const { data: book, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", bookId)
      .single();
    return { data: book, error };
  }
);


export const getOrderById = cache(
  async (supabase: SupabaseClient, orderId: string) => {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();
    return { data: order as OrderType, error };
  }
);

export const getOrderItemsByOrderId = cache(
  async (supabase: SupabaseClient, orderId: string) => {
    const { data: orderItems, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);
    return { data: orderItems as OrderItemType[], error };
  }
);

export const getOrdersWithOrderItems = cache(
  async (supabase: SupabaseClient, userId: string) => {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return { data: null, error };
    }

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: orderItems, error: orderItemsError } =
          await getOrderItemsByOrderId(supabase, order.id);
        return { ...order, items: orderItems, error: orderItemsError };
      })
    );

    return { data: ordersWithItems, error: null };
  }
);

export const getProductAndPriceByBookId = cache(
  async (supabase: SupabaseClient, bookId: string) => {
    const { data: product, error: productsError } = await supabase
      .from("products")
      .select("*, prices(*)")
      .eq("book_id", bookId)
      .single();

    return { data: product, error: productsError };
  }
);

export const createCart = async (supabase: SupabaseClient, userId: string) => {
  const { data: cart, error } = await supabase
    .from("cart")
    .insert({ user_id: userId })
    .select("*")
    .maybeSingle();
  return { data: cart, error };
};


export const createCartItem = async (
  supabase: SupabaseClient,
  cartId: string,
  bookId: string,
  productId: string
) => {
  const { data: cartItem, error } = await supabase
    .from("cart_items")
    .insert({ cart_id: cartId, book_id: bookId, product_id: productId })
    .select("*")
    .single();
  return { data: cartItem, error };
}


export const getOrCreateCart = async (
  supabase: SupabaseClient,
  userId: string
) => {
  const { data: existingCart, error: existingCartError } =
    await getCartByUserId(supabase, userId);

  if (existingCartError) {
    console.error("Error fetching existing cart:", existingCartError.message);
    return { error: existingCartError };
  }

  let cart;
  if (existingCart) {
    cart = existingCart;
  } else {
    const { data: newCart, error: newCartError } = await createCart(
      supabase,
      userId
    );

    if (newCartError) {
      return { error: newCartError };
    }

    cart = newCart;
  }

  const { data: cartItemsData, error: cartItemsError } = await supabase
    .from("cart_items")
    .select(
      `
        *,
        product:products(*),
        book:books(*),
        product_price:products!inner(prices(*))
      `
    )
    .eq("cart_id", cart.id);

  if (cartItemsError) {
    return { error: cartItemsError };
  }

  let amount = 0;
  let cartItems: EnhancedCartItemType[] = [];

  for (const item of cartItemsData) {
    const quantity = item.quantity;

    const currentBook = item.book;


    if (currentBook.stock < quantity) {
      return encodedRedirect("error", "/", "Not enough stock.");
    }

    const price = item.product_price.prices[0].unit_amount;

    amount += (quantity * price) / 100;

    cartItems.push({
      id: item.id,
      price: price / 100,
      quantity: quantity,
      book: currentBook,
      product: item.product,
      image_directory: currentBook.image_directory,
    });
  }

  const cartDetails = {
    id: cart.id,
    total: amount,
    cart_items: cartItems,
  };


  return { data: cartDetails, error: null };
};

export const getCartByUserId = async (
  supabase: SupabaseClient,
  userId: string
) => {
  const { data: cart, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return { data: cart, error };
};

export const createOrder = async (
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  itemsTotal: number,
  shippingCost: number,
) => {
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "Ordered",
      session_id: sessionId,
      items_total: itemsTotal,
      shipping_cost: shippingCost,

    })
    .select("*")
    .single();

  return { data: order, error };
};

export const updateOrderStatus = async (
  supabase: SupabaseClient,
  orderId: string,
  status: string
) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .single();
  return { data, error };
};

export const getStripeCustomerId = cache(
  async (supabase: SupabaseClient, userId: string) => {
    const { data: customer, error } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();
    return { data: customer?.stripe_customer_id, error };
  }
);

export const getPriceByProductId = cache(
  async (supabase: SupabaseClient, productId: string) => {
    const { data: price, error } = await supabase
      .from("prices")
      .select("*")
      .eq("product_id", productId)
      .single();
    return { data: price, error };
  }
);

export const updateBookImageDirectory = cache(
  async (supabase: SupabaseClient, bookId: string, imageDirectory: string) => {
    const { error } = await supabase
      .from("books")
      .update({ image_directory: imageDirectory })
      .eq("id", bookId);

    return { error };
  }
);

export const getOrderBySessionId = async (
  supabase: SupabaseClient,
  sessionId: string
) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  return { data: order, error };
};
