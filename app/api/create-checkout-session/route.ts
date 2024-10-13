import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();
  const { cartItems, successUrl, cancelUrl } = body;

  const user = await supabase.auth.getUser();
  const userId = user.data?.user?.id;
  const email = user.data?.user?.email;

  if (!userId || !cartItems || cartItems.length === 0) {
    return NextResponse.json(
      { message: 'Invalid session data' },
      { status: 400 }
    );
  }

  try {
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.book.title,
          description: item.book.description,

        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: lineItems,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { message: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
