import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/config";
import { getOrderBySessionId, getOrderItemsByOrderId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const session_id = body.session_id;

  const supabase = createClient();
  if (!session_id) {
    return NextResponse.json(
      { message: "Missing session ID" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (!session || session.payment_status !== "paid") {
    return NextResponse.json(
      { message: "Payment not completed" },
      { status: 400 }
    );
  }


  try {
    const { data: order, error: orderError } = await getOrderBySessionId(
      supabase,
      session.id
    );
    if (orderError) {
      console.error("Error fetching order:", orderError.message);
      return NextResponse.json(
        { message: orderError.message || "Server error" },
        { status: 500 }
      );
    }
    const { data: orderWithItems, error: orderItemsError } =
      await getOrderItemsByOrderId(supabase, order.id);

    if (orderItemsError) {
      console.error("Error fetching order items:", orderItemsError.message);
      return NextResponse.json(
        { message: orderItemsError.message || "Server error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderWithItems });
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
