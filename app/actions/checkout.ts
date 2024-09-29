import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/utils/stripe/config";
import { encodedRedirect } from "@/utils/utils";
import {
  getCartByUserId,
  getCartItemsByCartId,
  createOrder,
  createPayment,
  getStripeCustomerId,
  getUser,
  getCartDetailsByUserId,
  getPriceByProductId,
} from "@/utils/supabase/queries";
import { createOrRetrieveCustomer } from "@/utils/supabase/admin";

export const checkoutAction = async () => {
  const supabase = createClient();

  const user = await getUser(supabase);

  if (!user) {
    return {
      errorRedirect: encodedRedirect(
        "error",
        "/sign-in",
        "You must be signed in to checkout."
      ),
    };
  }

  const userId = user.id


  const { data: cart, error: cartItemsError } = await getCartDetailsByUserId(
    supabase,
    userId
  )





  if (cartItemsError) {
    console.error("Error fetching cart items:", cartItemsError?.message);
    // return {
    //   errorRedirect: encodedRedirect("error", "/cart", "Your cart is empty."),
    // };
  }


  let amount = 0;

  for (const item of cart.cart_items) {
    const price = item.product.price[0];

    const quantity = item.quantity;

    if (!price.unit_amount) {
      console.error(`Price unit_amount is undefined for price ${price.id}`);
      return {
        errorRedirect: encodedRedirect(
          "error",
          "/cart",
          `Invalid price for book with id ${item.book_id}.`
        ),
      };
    }

    const { data: currentBook, error: bookError } = await supabase
      .from("books")
      .select("stock")
      .eq("id", item.book_id)
      .single();

    if (bookError || !currentBook) {
      console.error("Error fetching book stock:", bookError?.message);
      return {
        errorRedirect: encodedRedirect(
          "error",
          "/cart",
          `Could not retrieve stock information for book with id ${item.book_id}.`
        ),
      };
    }

    if (currentBook.stock < quantity) {
      return {
        errorRedirect: encodedRedirect(
          "error",
          "/cart",
          `Insufficient stock for book. Only ${currentBook.stock} left in stock.`
        ),
      };
    }

    amount += quantity * price.unit_amount;
  }

  const { data: order, error: orderError } = await createOrder(
    supabase,
    userId,
    cart.cart_items
  );

  if (orderError) {
    console.error("Error creating order:", orderError.message);
    // return {
    //   errorRedirect: encodedRedirect(
    //     "error",
    //     "/cart",
    //     "Failed to create order."
    //   ),
    // };
  }

  const stripeCustomer = await createOrRetrieveCustomer({email: user.email!, uuid: user.id});

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "cad",
    customer: stripeCustomer,
    metadata: {
      order_id: order.id,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const paymentData = {
    order_id: order.id,
    amount: amount / 100,
    currency: "CAD",
    status: "initiated",
    payment_intent_id: paymentIntent.id,
  };

  const { error: paymentError } = await createPayment(
    supabase,
    order.id,
    paymentData
  );

  if (paymentError) {
    console.error("Error storing payment info:", paymentError.message);
    // return {
    //   errorRedirect: encodedRedirect(
    //     "error",
    //     "/cart",
    //     "Failed to store payment information."
    //   ),
    // };
  }



  try {


    await supabase
      .from("payments")
      .update({ payment_intent_id: paymentIntent.id })
      .eq("order_id", order.id);

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return {
      errorRedirect: encodedRedirect(
        "error",
        "/cart",
        "Failed to initiate payment."
      ),
    };
  }
};
