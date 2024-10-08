import { toDateTime } from '../helpers';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Database, Tables, TablesInsert } from '../database.types';
import { getProductAndPriceByBookId } from './queries';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;
type Book = Tables<'books'>;
type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;
type Customer = Tables<'customers'>;
type Cart = Tables<'cart'>;
type CartItem = Tables<'cart_items'>;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const upsertProductRecord = async (product: Stripe.Product) => {

  const {data: book} = await supabaseAdmin.from("books").select("*").eq("id", product.metadata.bookId).single();

  const productData: Product = {
    id: product.id,
    book_id: book?.id!,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    unit_amount: price.unit_amount ?? null,
    description: price.nickname ?? null,
    metadata: price.metadata,
    type: "one_time"
  };

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData]);

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  }
};

const deleteProductRecord = async (productId: string) => {
  await stripe.products.update(productId, { active: false });
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', productId);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
};

const deletePriceRecord = async (priceId: string) => {
  await stripe.prices.update(priceId, { active: false });
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', priceId);
  if (deletionError) throw new Error(`Price deletion failed: ${deletionError.message}`);
};


const deleteOrderRecord = async (orderId: string) => {
  const { error: deletionError } = await supabaseAdmin
    .from('orders')
    .delete()
    .eq('id', orderId);
  if (deletionError) throw new Error(`Order deletion failed: ${deletionError.message}`);
}

const deleteOrderItemsRecord = async (orderId: string) => {
  const { error: deletionError } = await supabaseAdmin
    .from('order_items')
    .delete()
    .eq('order_id', orderId);
  if (deletionError) throw new Error(`Order Items deletion failed: ${deletionError.message}`);
}

const deletePaymentRecord = async (paymentIntentId: string) => {
  const { error: deletionError } = await supabaseAdmin
    .from('payments')
    .delete()
    .eq('payment_intent_id', paymentIntentId);
  if (deletionError) throw new Error(`Payment deletion failed: ${deletionError.message}`);
}

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(`Supabase customer record creation failed: ${upsertError.message}`);

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`
        );
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
// const copyBillingDetailsToCustomer = async (
//   uuid: string,
//   payment_method: Stripe.PaymentMethod
// ) => {
//   //Todo: check this assertion
//   const customer = payment_method.customer as string;
//   const { name, phone, address } = payment_method.billing_details;
//   if (!name || !phone || !address) return;
//   //@ts-ignore
//   await stripe.customers.update(customer, { name, phone, address });
//   const { error: updateError } = await supabaseAdmin
//     .from('users')
//     .update({
//       billing_address: { ...address },
//       payment_method: { ...payment_method[payment_method.type] }
//     })
//     .eq('id', uuid);
//   if (updateError) throw new Error(`Customer update failed: ${updateError.message}`);
// };

const upsertPaymentRecord = async (paymentIntent: Stripe.PaymentIntent) => {

  const paymentData: Database["public"]["Tables"]["payments"]["Insert"] = {
    order_id: "",
    payment_intent_id: paymentIntent.id,
    amount: paymentIntent.amount_received / 100,
    currency: paymentIntent.currency.toUpperCase(),
    status: paymentIntent.status,
  };

  const { error } = await supabaseAdmin
    .from("payments")
    .upsert(paymentData, { onConflict: "payment_intent_id" });

  if (error) {
    console.error("Error upserting payment record:", error.message);
  }
};

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.order_id;
  if (!orderId) {
    console.error('Order ID not found in payment intent metadata');
    return;
  }

  const { error: orderUpdateError } = await supabaseAdmin
    .from('orders')
    .update({ status: 'Ordered' })
    .eq('id', orderId);

  if (orderUpdateError) {
    console.error('Error updating order status:', orderUpdateError.message);
    return;
  }

  const { data: orderData, error: orderFetchError } = await supabaseAdmin
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
    const { error: stockUpdateError } = await  supabaseAdmin
      .from('books')
      .update({
        stock:  (await supabaseAdmin.from('books').select('stock').eq('id', item.book_id).single()).data?.stock! - item.quantity
      })
      .eq('id', item.book_id);

    if (stockUpdateError) {
      console.error(
        `Error reducing stock for book ID ${item.book_id}:`,
        stockUpdateError.message
      );
    }
  }

  const { data: cartData, error: cartFetchError } = await supabaseAdmin
    .from('cart')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (cartFetchError || !cartData) {
    console.error('Error fetching cart data:', cartFetchError?.message);
    return;
  }

  const cartId = cartData.id;

  const { error: cartClearError } = await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (cartClearError) {
    console.error('Error clearing cart items:', cartClearError.message);
  }
}



export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  upsertPaymentRecord,
  deleteOrderRecord,
  deleteOrderItemsRecord,
  deletePaymentRecord,
  handlePaymentIntentSucceeded,
};
