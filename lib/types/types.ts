import { Database } from "@/utils/database.types";
import { OrderWithItemsType } from "../schemas/schemas";

export type CartType = Database["public"]["Tables"]["cart"]["Row"];

export type CartItemType = Database["public"]["Tables"]["cart_items"]["Row"];

export type OrderType = Database["public"]["Tables"]["orders"]["Row"];

export type OrderItemType = Database["public"]["Tables"]["order_items"]["Row"];

export type UserType = Database["public"]["Tables"]["users"]["Row"];

export type BookType = Database["public"]["Tables"]["books"]["Row"];

export type ProductType = Database["public"]["Tables"]["products"]["Row"];

export type PriceType = Database["public"]["Tables"]["prices"]["Row"];

export type OrderItemInsertType = Database["public"]["Tables"]["order_items"]["Insert"];


export type EnhancedCartItemType =  {
    id: string;
    price: number;
    quantity: number;
    book: BookType;
    product: ProductType;
    image_directory: string | null;
  }


  export type EmailType =
  | "contact"
  | "newsletter"
  | "order-confirmation"
  | "shipping-confirmation"
  | "delivery-confirmation";

interface BaseEmailData {
  email: string;
}

export interface ContactEmailData extends BaseEmailData {
  name: string;
  message: string;
}

export interface NewsletterEmailData extends BaseEmailData {
  content: string;
}


export interface OrderConfirmationEmailData extends BaseEmailData {
  orderId: string;
  orderItems: OrderItemInsertType[];
  totalAmount: string;
}

export interface ShippingConfirmationEmailData extends BaseEmailData {
  orderId: string;
  trackingNumber: string;
  shippingProvider: string;
}

export interface DeliveryConfirmationEmailData extends BaseEmailData {
  orderId: string;
}

export function isBookTypeArray(data: any[]): data is BookType[] {
  return data.every(item => 'id' in item && 'title' in item && 'author' in item);
}

export function isOrderWithItemsTypeArray(data: any[]): data is OrderWithItemsType[] {
  return data.every(item => 'orderId' in item && 'items' in item);
}
