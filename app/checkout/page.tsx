"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "@/components/checkout-form";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    // Fetch client secret from server
    fetch("/api/create-payment-intent", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            router.push("/cart");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error);
        if (isMounted) {
          router.push("/cart");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const appearance = {
    theme: "stripe" as const,
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
