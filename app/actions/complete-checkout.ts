"use server";
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/utils/stripe/config";
import { encodedRedirect } from "@/utils/utils";
import { createOrder, getUser } from "@/utils/supabase/queries";
import {
  createOrRetrieveCustomer,
  handlePaymentIntentSucceeded,
  upsertPaymentRecord,
} from "@/utils/supabase/admin";
import { EnhancedCartItemType } from "@/lib/types/types";

export const completeCheckoutAction = async (
  cartItems: EnhancedCartItemType[],
  paymentIntentId: string,
  finalAmount: number
) => {
  console.log("Final amount:", finalAmount);
  console.log("Cart items:", cartItems);
  const supabase = createClient();

  const user = await getUser(supabase);

  if (!user) {
    return {
      errorRedirect: encodedRedirect(
        "error",
        "/sign-in",
        "You must be signed in to checkout."
      ),
    };
  }

  const userId = user.id;

  const { data: order, error: orderError } = await createOrder(
    supabase,
    userId,
    cartItems
  );

  if (orderError) {
    console.error("Error creating order:", orderError.message);
    return {
      errorRedirect: encodedRedirect(
        "error",
        "/cart",
        "Failed to create order."
      ),
    };
  }

  const stripeCustomer = await createOrRetrieveCustomer({
    email: user.email!,
    uuid: user.id,
  });

  if (finalAmount < 50) {
    return {
      errorRedirect: encodedRedirect(
        "error",
        "/cart",
        "The total amount must be at least $0.50 CAD."
      ),
    };
  }

  await stripe.paymentIntents.update(paymentIntentId, {
    amount: finalAmount,
    currency: "cad",
    customer: stripeCustomer,
    metadata: {
      order_id: order.id,
    },
  });

  return order.id;
};
