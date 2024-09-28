import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { checkoutAction } from "../actions/checkout";
import CheckoutWrapper from "./checkout-wrapper";
import StripeWrapper from "./stripe-wrapper";
import { Message } from "@/components/form-message";
import { getOrderById } from "@/utils/supabase/queries";

export default async function Page({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { clientSecret, orderId, errorRedirect } = await checkoutAction();

  if (errorRedirect) {
    return redirect(errorRedirect);
  }

  if (!clientSecret || !orderId) {
    return <div>Loading...</div>;
  }

  const { data, error } = await getOrderById(supabase, orderId);


  if (error || !data) {
    return redirect("/cart");
  }

  return (
    <StripeWrapper clientSecret={clientSecret}>
      <CheckoutWrapper
        clientSecret={clientSecret}
        orderItems={data.items}
      />
    </StripeWrapper>
  );
}
