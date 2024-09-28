import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getUser = cache(async (supabase: SupabaseClient) => {
  const { data: user, error } = await supabase.auth.getUser();
  return { data: user, error };
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return { data: products, error };
});

export const getAllUsers = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails, error } = await supabase
    .from('users')
    .select('*');
  return { data: userDetails, error };
});

export const getPaymentById = cache(async (supabase: SupabaseClient, orderId: string) => {
  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .single();
  return { data: payment, error };
});

export const getAllBooks = cache(async (supabase: SupabaseClient) => {
  const { data: books, error } = await supabase
    .from('books')
    .select('*');
  return { data: books, error };
});

export const getBookById = cache(async (supabase: SupabaseClient, bookId: string) => {
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();
  return { data: book, error };
});

export const getOrderById = cache(async (supabase: SupabaseClient, orderId: string) => {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  return { data: order, error };
});

export const getOrderItemsByOrderId = cache(async (supabase: SupabaseClient, orderId: string) => {
  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  return { data: orderItems, error };
});


export const getOrdersWithOrderItems = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return { data: null, error };
  }

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const { data: orderItems, error: orderItemsError } = await getOrderItemsByOrderId(
        supabase,
        order.id
      );
      return { ...order, items: orderItems, error: orderItemsError };
    })
  );

  return { data: ordersWithItems, error: null };
});

export const getOrdersWithOrderItemsAndPayments = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: ordersWithItems, error: itemsError } = await getOrdersWithOrderItems(supabase, userId);

  if (itemsError) {
    return { data: null, error: itemsError };
  }

  const ordersWithItemsAndPayments = await Promise.all(
    ordersWithItems.map(async (order) => {
      const { data: payment, error: paymentError } = await getPaymentByOrderId(
        supabase,
        order.id
      );
      return { ...order, payment, error: paymentError };
    })
  );

  return { data: ordersWithItemsAndPayments, error: null };
});

export const getCartByUserId = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: cart, error } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data: cart, error };
});

export const getCartItemsByCartId = cache(async (supabase: SupabaseClient, cartId: string) => {
  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cartId);
  return { data: cartItems, error };
});

export const getAllOrders = cache(async (supabase: SupabaseClient) => {
  const { data: orders, error } = await supabase.from("orders").select("*");
  return { data: orders, error };
});

export const getOrdersByUserId = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId);
  return { data: orders, error };
});


export const getAllPayments = cache(async (supabase: SupabaseClient) => {
  const { data: payments, error } = await supabase.from("payments").select("*");
  return { data: payments, error };
});


export const getPaymentByOrderId = cache(async (supabase: SupabaseClient, orderId: string) => {
  const { data: payment, error } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .single();
  return { data: payment, error };
});

export const getProductsAndPricesByBookId = cache(async (supabase: SupabaseClient, bookId: string) => {
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("book_id", bookId)
    .eq("active", true);

  return { data: products, error: productsError };
});



export const getCartDetailsByUserId = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: cart, error: cartError } = await supabase
    .from('cart')
    .select('*, cart_items(*, product:products(*, prices(*)))')
    .eq('user_id', userId)
    .single();
  return { data: cart, error: cartError };
});

export const createOrder = async (supabase: SupabaseClient, userId: string, items: Array<any>) => {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "pending"
    })
    .select("*")
    .single();

  if (orderError) {
    return { data: null, error: orderError };
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    return { data: null, error: orderItemsError };
  }

  return { data: order, error: null };
};


export const createPayment = async (supabase: SupabaseClient, orderId: string, paymentDetails: any) => {
  const { data: payment, error } = await supabase
    .from("payments")
    .insert({
      order_id: orderId,
      status: "initiated",
      ...paymentDetails
    })
    .select("*")
    .single();

  return { data: payment, error };
};


export const updatePaymentStatus = async (supabase: SupabaseClient, paymentId: string, status: string) => {
  const { data, error } = await supabase
    .from("payments")
    .update({ status })
    .eq("id", paymentId)
    .single();
  return { data, error };
};


export const updateOrderStatus = async (supabase: SupabaseClient, orderId: string, status: string) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .single();
  return { data, error };
};

export const getStripeCustomerId = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: customer, error } = await supabase
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();
  return { data: customer?.stripe_customer_id, error };
});
