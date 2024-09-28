import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
} from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';


const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
]);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const supabase = createClient();

  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;



  try {
    if (!sig || !webhookSecret) {
      return new NextResponse('Webhook signature or secret not found.', {
        status: 400,
      });
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case 'price.deleted':
          await deletePriceRecord((event.data.object as Stripe.Price).id);
          break;
        case 'product.deleted':
          await deleteProductRecord((event.data.object as Stripe.Product).id);
          break;
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await handlePaymentIntentSucceeded(paymentIntent, supabase);
          break;
        default:
          console.warn(`Unhandled relevant event type: ${event.type}`);
          break;
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      return new NextResponse('Webhook handler failed.', { status: 400 });
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
    return new NextResponse(`Unhandled event type: ${event.type}`, { status: 400 });
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const orderId = paymentIntent.metadata?.order_id;
  if (!orderId) {
    console.error('Order ID not found in payment intent metadata');
    return;
  }

  const { error: orderUpdateError } = await supabase
    .from('orders')
    .update({ status: 'Paid' })
    .eq('id', orderId);

  if (orderUpdateError) {
    console.error('Error updating order status:', orderUpdateError.message);
    return;
  }

  const { data: orderData, error: orderFetchError } = await supabase
    .from('orders')
    .select('user_id, order_items (book_id, quantity)')
    .eq('id', orderId)
    .single();

  if (orderFetchError || !orderData) {
    console.error('Error fetching order data:', orderFetchError?.message);
    return;
  }

  const userId = orderData.user_id;
  const orderItems = orderData.order_items;

  for (const item of orderItems) {
    const { error: stockUpdateError } = await supabase
      .from('books')
      .update({
        stock: supabase.raw('stock - ?', [item.quantity]),
      })
      .eq('id', item.book_id);

    if (stockUpdateError) {
      console.error(
        `Error reducing stock for book ID ${item.book_id}:`,
        stockUpdateError.message
      );
    }
  }

  const { data: cartData, error: cartFetchError } = await supabase
    .from('cart')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (cartFetchError || !cartData) {
    console.error('Error fetching cart data:', cartFetchError?.message);
    return;
  }

  const cartId = cartData.id;


  const { error: cartClearError } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (cartClearError) {
    console.error('Error clearing cart items:', cartClearError.message);
  } else {
    console.log('Cart items cleared for cart ID:', cartId);
  }

}
