import { stripe } from "@/utils/stripe/config";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type { Database } from "../database.types";
import {
  createOrder,
  getOrCreateCart,
  getUserDataById,
} from "./queries";
import { OrderItemInsertType, PriceType, ProductType } from "@/lib/types/types";
import { sendEmail } from "@/app/actions/send-email";

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const upsertProductRecord = async (product: Stripe.Product) => {
  const { data: book } = await supabaseAdmin
    .from("books")
    .select("*")
    .eq("id", product.metadata.bookId)
    .single();

  const productData: ProductType = {
    id: product.id,
    book_id: book?.id!,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("products")
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: PriceType = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    unit_amount: price.unit_amount ?? null,
    description: price.nickname ?? null,
    metadata: price.metadata,
    type: "one_time",
  };

  const { error: upsertError } = await supabaseAdmin
    .from("prices")
    .upsert([priceData]);

  if (upsertError?.message.includes("foreign key constraint")) {
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
    .from("products")
    .delete()
    .eq("id", productId);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
};

const deletePriceRecord = async (priceId: string) => {
  await stripe.prices.update(priceId, { active: false });
  const { error: deletionError } = await supabaseAdmin
    .from("prices")
    .delete()
    .eq("id", priceId);
  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`);
};

const deleteOrderRecord = async (orderId: string) => {
  const { error: deletionError } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("id", orderId);
  if (deletionError)
    throw new Error(`Order deletion failed: ${deletionError.message}`);
};

const deleteOrderItemsRecord = async (orderId: string) => {
  const { error: deletionError } = await supabaseAdmin
    .from("order_items")
    .delete()
    .eq("order_id", orderId);
  if (deletionError)
    throw new Error(`Order Items deletion failed: ${deletionError.message}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from("customers")
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`
    );

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error("Stripe customer creation failed.");

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from("customers")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`
        );
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`
      );
    }
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error("Supabase customer record creation failed.");

    return upsertedStripeCustomer;
  }
};

const copyBillingAndShippingDetailsToCustomer = async (
  userId: string,
  payment_method: Stripe.PaymentMethod,
  address_details: Stripe.Address
) => {
  const customer = payment_method.customer as string;
  const { name, phone, address } =
    payment_method.billing_details as Stripe.PaymentMethod.BillingDetails;
  const { line1, line2, city, state, postal_code, country } =
    address_details as Stripe.Address;
  if (!name || !phone || !address) return;

  const sanitizedAddress = {
    line1: line1 || undefined,
    line2: line2 || undefined,
    city: city || undefined,
    state: state || undefined,
    postal_code: postal_code || undefined,
    country: country || undefined,
  };

  //@ts-ignore
  await stripe.customers.update(customer, {
    name,
    phone,
    address: sanitizedAddress,
    shipping: {
      name,
      phone,
      address: sanitizedAddress,
    },
  });
  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({
      shipping_address: { ...address_details },
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", userId);
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`);
};

const placeOrder = async (session: Stripe.Checkout.Session) => {
  const sessionId = session.id;
  const userId = session?.metadata?.userId;

  if (!userId) {
    throw new Error("User ID not found in session metadata");
  }

  const { data: order, error: orderError } = await createOrder(
    supabaseAdmin,
    userId,
    sessionId
  );

  if (orderError) {
    throw new Error(`Error creating order: ${orderError.message}`);
  }

  const { data: userData, error: userError } = await getUserDataById(
    supabaseAdmin,
    userId
  );

  if (userError) {
    throw userError;
  }

  const { data: cartDetails, error: cartError } = await getOrCreateCart(
    supabaseAdmin,
    userId
  );

  if (cartError) {
    throw cartError;
  }

  const orderItemsData = cartDetails.cart_items.map((item: any) => ({
    order_id: order.id!,
    book_id: item.book.id,
    book_title: item.book.title,
    book_author: item.book.author,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.price,
    image_directory: item.book.image_directory,
  })) as OrderItemInsertType[];

  const { error: orderItemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItemsData);

  if (orderItemsError) {
    throw orderItemsError;
  }

  return {
    userData,
    orderItemsData,
    order,
    userId,
  };
};

async function handleCheckoutSucceeded(session: Stripe.Checkout.Session) {
  try {
    const { userData, orderItemsData, order, userId } =
      await placeOrder(session);

    const email = userData.email;
    const orderId = order.id;
    const orderItems = orderItemsData;
    const totalAmount = ((session.amount_total ?? 0) / 100).toFixed(2);

    await sendEmail(
      { name: userData.name, email, orderId, orderItems, totalAmount },
      "order-confirmation"
    );

    for (const item of orderItems) {
      const { data: bookData, error: bookFetchError } = await supabaseAdmin
        .from("books")
        .select("stock")
        .eq("id", item.book_id)
        .single();

      if (bookFetchError) {
        console.error(
          `Error fetching stock for book ID ${item.book_id}:`,
          bookFetchError.message
        );
        continue;
      }

      const newStock = (bookData?.stock ?? 0) - item.quantity;

      const { error: stockUpdateError } = await supabaseAdmin
        .from("books")
        .update({ stock: newStock })
        .eq("id", item.book_id);

      if (stockUpdateError) {
        console.error(
          `Error reducing stock for book ID ${item.book_id}:`,
          stockUpdateError.message
        );
        throw new Error("Error reducing stock for book.");
      }
    }

    const { data: cartData, error: cartFetchError } = await supabaseAdmin
      .from("cart")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (cartFetchError || !cartData) {
      console.error("Error fetching cart data:", cartFetchError?.message);
      throw new Error("Error fetching cart data.");
    }

    const cartId = cartData.id;

    const { error: cartClearError } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);

    if (cartClearError) {
      console.error("Error clearing cart items:", cartClearError.message);
      throw new Error("Error clearing cart items.");
    }
  } catch (error: any) {
    console.error("Error placing order:", error?.message);
  }
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  deleteOrderRecord,
  deleteOrderItemsRecord,
  handleCheckoutSucceeded,
};
