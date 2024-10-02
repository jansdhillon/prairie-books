"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function ShippingAndDeliveryPage() {
  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-3xl font-bold text-left">Shipping & Delivery</h1>
      <Separator />

      <p className="text-lg text-muted-foreground">
        Learn about our shipping options and delivery policies.
      </p>

      <div className="space-y-8">
        {/* Shipping Options */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Shipping Options</h2>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">1. Standard Shipping</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <strong>Cost:</strong> $5 flat rate per order.
              </li>
              <li>
                <strong>Delivery Time:</strong> 3-5 business days within Canada.
              </li>
              <li>
                <strong>Details:</strong> Orders are shipped via Canada Post or
                similar carriers. Tracking information will be provided once
                your order has been shipped.
              </li>
            </ul>
          </div>

          {/* Free Shipping */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">2. Free Shipping</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <strong>Eligibility:</strong> Orders over $75 before taxes.
              </li>
              <li>
                <strong>Delivery Time:</strong> 3-5 business days within Canada.
              </li>
              <li>
                <strong>Details:</strong> Free standard shipping is
                automatically applied at checkout for eligible orders.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              3. Local Delivery (Calgary, Alberta)
            </h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <strong>Cost:</strong> Free.
              </li>
              <li>
                <strong>Delivery Time:</strong> 1-2 business days.
              </li>
              <li>
                <strong>Details:</strong> We offer free local delivery within
                Calgary city limits. Simply select "Local Delivery" at checkout
                if your shipping address is within Calgary. Kathrin will contact you to arrange a delivery time.
              </li>
            </ul>
          </div>
        </div>

        {/* Order Processing Time */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Order Processing Time</h2>
          <p>
            Orders are processed and shipped within 1-2 business days. Orders
            placed after 2 PM or on weekends will be processed the next business
            day.
          </p>
        </div>

        {/* Tracking Your Order */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Tracking Your Order</h2>
          <p>
            You will receive a confirmation email with tracking information once
            your order has been shipped.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">International Shipping</h2>
          <p>
            Currently, we do not offer international shipping. We apologize for
            any inconvenience.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div>
              <h2 className="text-2xl font-semibold">
                Questions or Special Requests?
              </h2>
          </div>
          <Link href="/contact">
              <Button variant="default" >
                Contact
              </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
