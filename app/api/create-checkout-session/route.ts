import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { getURL } from '@/utils/helpers';

export async function POST(req: Request) {
  const body = await req.json();
  const { cartItems, total, userId } = body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: item.book.title,
            description: item.book.author,
            images: [`${item.book.image_directory}image-1.png`],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["CA"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'cad' },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        total > 75 ? {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'cad' },
            display_name: 'Free shipping on orders over $75',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        } : {},
        ],
      success_url: `${getURL("success")}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: userId,
      },

    });



    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}