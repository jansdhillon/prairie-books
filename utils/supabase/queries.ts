import { EnhancedCartItemType, OrderItemType } from "@/lib/types/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getAllUserData = async (supabase: SupabaseClient) => {
  const { data: user, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error fetching user data:", authError.message);
    return { data: null, error: authError };
  }

  const {data: userData} = await getUserDataById(supabase, user.user.id);

  return { data: userData, error: authError };
};

export const getUserDataById = async (
  supabase: SupabaseClient,
  userId: string
) => {
  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  return { data: userData, error: error };
};

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

export const getCartDetailsByUserId = cache(
  async (supabase: SupabaseClient, userId: string) => {
    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("*, cart_items(*, product:products(*, price: prices(*)))")
      .eq("user_id", userId)
      .single();

    if (cartError) {
      console.error("Error fetching cart details:", cartError?.message);
    }

    let amount = 0;
    let cartDetails = {
      id: cart?.id,
      total: amount,
      cart_items: [] as EnhancedCartItemType[],
    };

    for (const item of cart?.cart_items) {
      const price = item.product.price[item.product.price.length - 1];

      const quantity = item.quantity;

      const { data: currentBook, error: bookError } = await supabase
        .from("books")
        .select("*")
        .eq("id", item.book_id)
        .single();

      if (bookError) {
        throw new Error(`Error fetching book stock: ${bookError.message}`);
      }

      if (currentBook.stock < quantity) {
        throw new Error(`Insufficient stock for book with id ${item.book_id}.`);
      }

      amount += (quantity * price.unit_amount) / 100;

      cartDetails.cart_items?.push({
        id: item.id,
        price: price.unit_amount / 100,
        quantity: quantity,
        book: currentBook,
        product: item.product,
      });
    }

    cartDetails.total = amount;

    return { data: cartDetails, error: cartError };
  }
);

export const getCartByUserId = cache(
  async (supabase: SupabaseClient, userId: string) => {
    const { data: cart, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data: cart, error };
  }
);

export const createOrder = async (
  supabase: SupabaseClient,
  userId: string,
  sessionId: string
) => {
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "Ordered",
      session_id: sessionId,
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

export const getOrderBySessionId = async (supabase: SupabaseClient, sessionId: string) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  return { data: order, error };
}
