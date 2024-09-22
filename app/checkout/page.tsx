import { loadStripe } from "@stripe/stripe-js";
import { checkoutAction } from "../actions/checkout";
import CheckoutWrapper from "./checkout-wrapper";
import { getCartItemsAction } from "../actions/get-cart-items";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getOrderById } from "../actions/get-order-by-id";
import { Elements } from "@stripe/react-stripe-js";
import Stripe from "stripe";
import StripeWrapper from "./stripe-wrapper";
import { Message } from "@/components/form-message";

export default async function Page({ searchParams }: { searchParams: Message }) {
  const { clientSecret, dpmCheckerLink, orderId } = await checkoutAction();

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const orderItemsWithPayments = await getOrderById(orderId);

  return !clientSecret ? (
    <div>loading...</div>
  ) : (
    <StripeWrapper clientSecret={clientSecret}>
      <CheckoutWrapper
        clientSecret={clientSecret}
        dpmCheckerLink={dpmCheckerLink}
        orderItems={orderItemsWithPayments.items}
        payment={orderItemsWithPayments.payment}
      />
    </StripeWrapper>
  );
}
