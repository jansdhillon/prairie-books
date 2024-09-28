"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";

export const updateOrderAction = async (formData: FormData) => {
  const supabase = createClient();

  const orderId = formData.get("orderId")?.toString();
  const shippingInfoStr = formData.get("shippingInfo")?.toString();
  const billingInfoStr = formData.get("billingInfo")?.toString();

  if (!orderId || !shippingInfoStr || !billingInfoStr) {
    return {
      errorRedirect: encodedRedirect("error", "/checkout", "Missing required information."),
    };
  }

  const shippingInfo = JSON.parse(shippingInfoStr);
  const billingInfo = JSON.parse(billingInfoStr);

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      shipping_address: shippingInfo,
      billing_address: billingInfo,
    })
    .eq("id", orderId);

  if (updateError) {
    console.error("Error updating order:", updateError.message);
    return {
      errorRedirect: encodedRedirect("error", "/checkout", "Failed to update order."),
    };
  }

  return {};
};
