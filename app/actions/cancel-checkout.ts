"use server";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { stripe } from "@/utils/stripe/config";

export const cancelCheckoutAction = async (paymentIntentId: string) => {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      errorRedirect: encodedRedirect(
        "error",
        "/sign-in",
        "You must be signed in to cancel the checkout."
      ),
    };
  }

  const userId = user.id;

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("id, payment_intent_id, status")
    .eq("payment_intent_id", paymentIntentId)
    .eq("user_id", userId)
    .single();

  if (paymentError || !payment) {
    console.error("Error fetching payment:", paymentError?.message);
    return {
      errorRedirect: encodedRedirect("error", "/cart", "Payment record not found."),
    };
  }

  // Check if the payment is already canceled or succeeded
  if (payment.status === "canceled") {
    return {
      errorRedirect: encodedRedirect("error", `/cart`, "Checkout is already canceled."),
    };
  }

  if (payment.status === "succeeded") {
    return {
      errorRedirect: encodedRedirect(
        "error",
        `/cart`,
        "Completed payments cannot be canceled."
      ),
    };
  }

  try {
    const canceledPaymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    console.log("PaymentIntent canceled:", canceledPaymentIntent.id);
  } catch (error: any) {
    console.error("Error canceling PaymentIntent:", error.message);
    return {
      errorRedirect: encodedRedirect(
        "error",
        `/cart`,
        "Failed to cancel payment intent. Please contact support."
      ),
    };
  }

  // Update the payment status to 'canceled' in Supabase
  const { error: updateError } = await supabase
    .from("payments")
    .update({ status: "canceled" })
    .eq("payment_intent_id", paymentIntentId)
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating payment status:", updateError.message);
    return {
      errorRedirect: encodedRedirect(
        "error",
        `/cart`,
        "Failed to update payment status."
      ),
    };
  }

  // Optionally, restore stock quantities if necessary
  const { data: cart, error: cartError } = await supabase
    .from("cart")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (cartError || !cart) {
    console.error("Error fetching cart:", cartError?.message);
  } else {
    const { data: cartItems, error: cartItemsError } = await supabase
      .from("cart_items")
      .select("book_id, quantity")
      .eq("cart_id", cart.id);

    if (cartItemsError || !cartItems) {
      console.error("Error fetching cart items:", cartItemsError?.message);
    } else {
      for (const item of cartItems) {
        const { error: stockError } = await supabase
          .from("books")
          .update({ stock: { _inc: item.quantity } })
          .eq("id", item.book_id);

        if (stockError) {
          console.error(
            `Error restoring stock for book ${item.book_id}:`,
            stockError.message
          );

        }
      }
    }
  }

  return {
    successRedirect: encodedRedirect(
      "success",
      `/cart`,
      "Checkout has been successfully canceled."
    ),
  };
};
