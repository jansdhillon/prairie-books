import { loadStripe } from "@stripe/stripe-js";
import { checkoutAction } from "../actions/checkout";
import CheckoutWrapper from "./checkout-wrapper";
import { getCartItemsAction } from "../actions/get-cart-items";

export default async function Page() {
  const { clientSecret, dpmCheckerLink } = await checkoutAction();

  console.log("clientSecret", clientSecret);

  const { cartItems } = await getCartItemsAction();

  console.log("cartItems", cartItems);

  return !clientSecret ? (
    <div>loading...</div>
  ) : (
    <CheckoutWrapper
      clientSecret={clientSecret}
      dpmCheckerLink={dpmCheckerLink}
      cartItems={cartItems}
    />
  );
}
