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
import { createOrRetrieveCustomer, upsertPaymentRecord } from "@/utils/supabase/admin";

export const startCheckoutAction = async () => {
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

  console.log("cart", cart.cart_items)





  if (cartItemsError) {
    console.error("Error fetching cart items:", cartItemsError?.message);
    // return {
    //   errorRedirect: encodedRedirect("error", "/cart", "Your cart is empty."),
    // };
  }


  let initialAmount = 0;

  let cartDetails = [];

  for (const item of cart.cart_items) {
    console.log("item", item)
    const price = item.product.price[item.product.price.length - 1];

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
      .select("*")
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

    initialAmount += quantity * price.unit_amount;

    console.log("price", price)
    console.log("quantity", quantity)

    console.log("initialAmount", initialAmount)



    cartDetails.push(
      {
        id: item.id,
        price: price.unit_amount / 100,
        quantity: quantity,
        book: currentBook,
        product: item.product,
      }
    )
  }


  const stripeCustomer = await createOrRetrieveCustomer({email: user.email!, uuid: user.id});

  const paymentIntent = await stripe.paymentIntents.create({
    amount: initialAmount,
    currency: "cad",
    customer: stripeCustomer,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const paymentData = {
    amount: initialAmount / 100,
    currency: "CAD",
    status: "initiated",
    payment_intent_id: paymentIntent.id,
    user_id: userId,
  };

  const { error: paymentError } = await createPayment(
    supabase,
    paymentData
  );

  if (paymentError) {
    console.error("Error storing payment info:", paymentError);
    // return {
    //   errorRedirect: encodedRedirect(
    //     "error",
    //     "/cart",
    //     "Failed to store payment information."
    //   ),
    // };
  }



  try {



    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      initialAmount: initialAmount,
      cartDetails: cartDetails,
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
