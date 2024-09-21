"use client";
import CompletePage from "@/components/complete-page";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "");

export default function Page({ params }: { params: { clientSecret: string } }) {
  return (
    <Elements stripe={stripe}>
      <CompletePage clientSecret={params.clientSecret} />
    </Elements>
  );
}
