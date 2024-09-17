import { loadStripe } from "@stripe/stripe-js";
import { checkoutAction } from "../actions/checkout";
import CheckoutWrapper from "./checkout-wrapper";

export default async function Page() {
  const { clientSecret, dpmCheckerLink } = await checkoutAction();

  console.log("clientSecret", clientSecret);

  return !clientSecret ? (
    <div>loading...</div>
  ) : (
    <CheckoutWrapper
      clientSecret={clientSecret}
      dpmCheckerLink={dpmCheckerLink}
    />
  );
}
