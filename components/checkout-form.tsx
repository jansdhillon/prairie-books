// components/checkout-form.tsx

import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

type CheckoutFormProps = {
  dpmCheckerLink?: string;
};

export default function CheckoutForm({ dpmCheckerLink }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/complete`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">{isLoading ? "Processing..." : "Pay now"}</span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
      {/* Conditionally render the annotation */}
      {dpmCheckerLink && (
        <div id="dpm-annotation">
          <p>
            Payment methods are dynamically displayed based on customer location, order amount, and
            currency.&nbsp;
            <a
              href={dpmCheckerLink}
              target="_blank"
              rel="noopener noreferrer"
              id="dpm-integration-checker"
            >
              Preview payment methods by transaction
            </a>
          </p>
        </div>
      )}
    </>
  );
}
