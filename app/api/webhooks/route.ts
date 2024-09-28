import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  upsertPaymentRecord
} from '@/utils/supabase/admin';
import { buffer } from 'micro';
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
  'payment_intent.payment_failed'
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
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
          await deletePriceRecord(event.data.object.id as string);
          break;
        case 'product.deleted':
          await deleteProductRecord(event.data.object.id as string);
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'payment') {
          }
          break;
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await handlePaymentIntentSucceeded(paymentIntent);
            break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error(error);
      return new Response(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400
    });
  }
  return new Response(JSON.stringify({ received: true }));
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.order_id;
  if (!orderId) {
    console.error('Order ID not found in payment intent metadata');
    return;
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'Paid' })
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error updating order status:', error.message);
  } else {
    console.log('Order status updated to Paid for order ID:', orderId);
  }

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('user_id')
    .eq('id', orderId)
    .single();

  if (orderError || !orderData) {
    console.error('Error fetching order data:', orderError?.message);
    return;
  }

  const userId = orderData.user_id;

  const { data: cartData, error: cartError } = await supabase
    .from('cart')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (cartError || !cartData) {
    console.error('Error fetching cart data:', cartError?.message);
    return;
  }

  const cartId = cartData.id;

  const { error: cartItemsError } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (cartItemsError) {
    console.error('Error clearing cart items:', cartItemsError.message);
  } else {
    console.log('Cart items cleared for cart ID:', cartId);
  }
}
