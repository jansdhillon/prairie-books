import { redirect } from "next/navigation";
import StripeWrapper from "./stripe-wrapper";
import CheckoutWrapper from "./checkout-wrapper";
import { getErrorRedirect } from "@/utils/helpers";
import { startCheckoutAction } from "../actions/start-checkout";
import { completeCheckoutAction } from "../actions/complete-checkout";
import { cancelCheckoutAction } from "../actions/cancel-checkout";



export default async function CheckoutPage() {
  const { clientSecret, paymentIntentId, cartDetails } = await startCheckoutAction();





  if (!clientSecret || !cartDetails) {
   redirect(getErrorRedirect("/cart", "Error fetching order items"));
  }



  return (
    <StripeWrapper clientSecret={clientSecret}>
      <CheckoutWrapper
        paymentIntentId={paymentIntentId}
        cartItems={cartDetails}
        completeCheckoutAction={completeCheckoutAction}
        cancelCheckoutAction={cancelCheckoutAction}
      />
    </StripeWrapper>
  );
}
