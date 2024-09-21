"use server";
import { createClient } from "@/utils/supabase/server";

const getOrderItemsByOrderId = async (orderId: string) => {
  const supabase = createClient();
  const { data: order_items, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (error) {
    console.error("Error fetching orders:", error.message);
  }

  if (!order_items) {
    return null;
  }

  const orderItemsWithBooks = await Promise.all(
    order_items.map(async (orderItem: any) => {
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("*")
        .eq("id", orderItem.book_id)
        .single();

      if (bookError) {
        console.error("Error fetching book:", bookError.message);
      }

      return {
        ...orderItem,
        book,
      };
    })
  );



  return orderItemsWithBooks;
};

export { getOrderItemsByOrderId };
