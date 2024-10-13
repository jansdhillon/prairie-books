import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { getOrderById } from '@/app/actions/get-order-by-id';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const order_id = url.searchParams.get('order_id');
  const session_id = url.searchParams.get('session_id');

  if (!order_id || !session_id) {
    return NextResponse.json({ message: "Missing order ID or session ID" }, { status: 400 });
  }

  try {
    const { data: order, error } = await getOrderById(order_id);

    if (error || !order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ message: "Payment not completed" }, { status: 400 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
