"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ""
  );


  export default function CheckoutWrapper({children, clientSecret}: {children: ReactNode | ReactNode[], clientSecret: string}) {
    return (
      <Elements stripe={stripePromise} options={{clientSecret: clientSecret}}>
        {children}
      </Elements>
    );
  }
