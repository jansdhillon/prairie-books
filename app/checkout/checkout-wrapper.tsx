"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "@/components/checkout-form";
import { checkoutAction } from "../actions/checkout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompletePage from "@/components/complete-page";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ""
);

export default function CheckoutWrapper({clientSecret, dpmCheckerLink}: {clientSecret: string, dpmCheckerLink: string}) {
  const [confirmed, setConfirmed] = useState(false);


  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="container mx-auto p-6">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
           {confirmed ? <CompletePage clientSecret={clientSecret} /> : <CheckoutForm dpmCheckerLink={dpmCheckerLink} />}
        </Elements>
      )}
    </div>
  );
}
