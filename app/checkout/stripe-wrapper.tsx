"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export default function StripeWrapper({
  children,
  clientSecret,
}: {
  children: ReactNode | ReactNode[];
  clientSecret: string;
}) {
  if (!clientSecret) {
    return null;
  }


  const { resolvedTheme } = useTheme();



  const options: StripeElementsOptions = {
    clientSecret: clientSecret,
    appearance: {
      theme: resolvedTheme === "dark" ? "night" : "stripe",
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
