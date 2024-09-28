import { redirect, useRouter } from "next/navigation";
import StripeWrapper from "./stripe-wrapper";
import CheckoutWrapper from "./checkout-wrapper";
import { getOrderById } from "@/app/actions/get-order-by-id";
import { getErrorRedirect } from "@/utils/helpers";
import { checkoutAction } from "../actions/checkout";

interface Book {
  title: string;
  author: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  book: Book;
}

interface CheckoutWrapperProps {
  clientSecret: string;
  orderItems: OrderItem[];
  orderId: string;
}

export default async function CheckoutPage() {
  const { clientSecret, orderId } = await checkoutAction();

  if (!clientSecret || !orderId) {
    return <div>Loading...</div>;
  }

  const { data: orderItems, error } = await getOrderById(orderId);



  if (!orderItems) {
   redirect(getErrorRedirect("/cart", "Error fetching order items"));
  }

  return (
    <StripeWrapper clientSecret={clientSecret}>
      <CheckoutWrapper
        clientSecret={clientSecret}
        orderItems={orderItems.items}
        orderId={orderId}
      />
    </StripeWrapper>
  );
}
