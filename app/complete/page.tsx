// app/complete/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";

export default function CompletePage() {
  const stripe = useStripe();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("Processing...");

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = searchParams.get("payment_intent_client_secret");

    if (!clientSecret) {
      setMessage("No payment intent client secret found.");
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setMessage("Unable to retrieve payment intent.");
        return;
      }

      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, searchParams]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold">Payment Status</h2>
      <p>{message}</p>
    </div>
  );
}
